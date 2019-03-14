import { WorkItemStateColor } from "azure-devops-extension-api/WorkItemTracking";
import { ActionsOfType } from "Common/Redux/Helpers";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { WorkItemTypeStateActions, WorkItemTypeStateActionTypes } from "./Actions";
import { IWorkItemTypeStateColors } from "./Contracts";
import { fetchWorkItemTypeStates } from "./DataSource";
import { getWorkItemTypeStates } from "./Selectors";

export function* workItemTypeStatesSaga(): SagaIterator {
    yield takeEvery(WorkItemTypeStateActionTypes.LoadRequested, loadWorkItemTypeStates);
}

function* loadWorkItemTypeStates(action: ActionsOfType<WorkItemTypeStateActions, WorkItemTypeStateActionTypes.LoadRequested>): SagaIterator {
    const workItemTypeName = action.payload;
    const workItemTypeStates: IWorkItemTypeStateColors | undefined = yield select(getWorkItemTypeStates, workItemTypeName);
    if (!workItemTypeStates) {
        yield put(WorkItemTypeStateActions.beginLoad(workItemTypeName));
        try {
            const data: WorkItemStateColor[] = yield call(fetchWorkItemTypeStates, workItemTypeName);
            yield put(WorkItemTypeStateActions.loadSucceeded(workItemTypeName, data));
        } catch (error) {
            yield put(WorkItemTypeStateActions.loadFailed(workItemTypeName, error.message || error));
        }
    }
}
