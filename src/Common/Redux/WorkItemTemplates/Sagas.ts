import {
    WorkItemTemplate, WorkItemTemplateReference
} from "azure-devops-extension-api/WorkItemTracking";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { ActionsOfType } from "../Helpers";
import {
    TeamTemplateActionTypes, TeamTemplatesActions, WorkItemTemplateActions,
    WorkItemTemplateActionTypes
} from "./Actions";
import { ITeamTemplates, IWorkItemTemplate } from "./Contracts";
import { fetchTeamTemplates, fetchTemplate } from "./DataSource";
import { getTeamTemplates, getTemplate } from "./Selectors";

export function* workItemTemplatesSaga(): SagaIterator {
    yield takeEvery(TeamTemplateActionTypes.LoadRequested, loadTeamTemplates);
    yield takeEvery(WorkItemTemplateActionTypes.LoadRequested, loadWorkItemTemplate);
}

function* loadTeamTemplates(action: ActionsOfType<TeamTemplatesActions, TeamTemplateActionTypes.LoadRequested>): SagaIterator {
    const teamId = action.payload;
    const teamTemplates: ITeamTemplates | undefined = yield select(getTeamTemplates, teamId);
    if (!teamTemplates) {
        yield put(TeamTemplatesActions.beginLoad(teamId));
        try {
            const data: WorkItemTemplateReference[] = yield call(fetchTeamTemplates, teamId);
            yield put(TeamTemplatesActions.loadSucceeded(teamId, data));
        } catch (error) {
            yield put(TeamTemplatesActions.loadFailed(teamId, error.message || error));
        }
    }
}

function* loadWorkItemTemplate(action: ActionsOfType<WorkItemTemplateActions, WorkItemTemplateActionTypes.LoadRequested>): SagaIterator {
    const { teamId, templateId } = action.payload;
    const template: IWorkItemTemplate | undefined = yield select(getTemplate, templateId);
    if (!template) {
        yield put(WorkItemTemplateActions.beginLoad(templateId));
        try {
            const data: WorkItemTemplate = yield call(fetchTemplate, teamId, templateId);
            yield put(WorkItemTemplateActions.loadSucceeded(data));
        } catch (error) {
            yield put(WorkItemTemplateActions.loadFailed(templateId, error.message || error));
        }
    }
}
