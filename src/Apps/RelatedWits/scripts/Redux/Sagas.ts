import { equals } from "azure-devops-ui/Core/Util/String";
import { WorkItemFormActions, WorkItemFormActionTypes } from "Common/AzDev/WorkItemForm/Redux/Actions";
import { CoreFieldRefNames } from "Common/Constants";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { getWorkItemFormService } from "Common/ServiceWrappers/WorkItemFormServices";
import { contains } from "Common/Utilities/Array";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { ExcludedFields, QueryableFieldTypes, SortableFieldTypes } from "../Constants";
import { createQuery, fieldNameComparer } from "../Helpers";
import { ISettings } from "../Interfaces";
import { ActiveWorkItemActions, RelatedWorkItemActions, RelatedWorkItemActionTypes, RelatedWorkItemSettingsActions } from "./Actions";
import { IActiveWorkItemState } from "./Contracts";
import { fetchSettings, fetchWorkItems } from "./DataSources";
import { getRelatedWitsStatus, getSettings, getSettingsStatus } from "./Selectors";

export function* relatedWitsSaga() {
    yield takeEvery(
        [WorkItemFormActionTypes.WorkItemLoaded, WorkItemFormActionTypes.WorkItemRefreshed, WorkItemFormActionTypes.WorkItemSaved],
        onWorkItemChanged
    );

    yield takeEvery(RelatedWorkItemActionTypes.LoadRequested, requestLoad);
}

function* onWorkItemChanged(
    action: ActionsOfType<
        WorkItemFormActions,
        WorkItemFormActionTypes.WorkItemLoaded | WorkItemFormActionTypes.WorkItemRefreshed | WorkItemFormActionTypes.WorkItemSaved
    >
) {
    const { id } = action.payload;
    if (id > 0) {
        yield put(RelatedWorkItemActions.loadRequested(id));
    }
}

function* requestLoad(action: ActionsOfType<RelatedWorkItemActions, RelatedWorkItemActionTypes.LoadRequested>) {
    const workItemId = action.payload;
    const status: RT<typeof getRelatedWitsStatus> = yield select(getRelatedWitsStatus, workItemId);
    const activeWorkItem: IActiveWorkItemState = yield call(getActiveWorkItem);
    yield put(ActiveWorkItemActions.setActiveWorkItem(activeWorkItem));
    yield call(loadSettings, activeWorkItem.project!, activeWorkItem.workItemTypeName!);

    const settings: ISettings = yield select(getSettings);

    if (status !== LoadStatus.Loading) {
        yield put(RelatedWorkItemActions.beginLoad(workItemId));
        try {
            const wiql: string = yield call(createQuery, activeWorkItem.project!, settings.fields, settings.sortByField);
            const workItems: RT<typeof fetchWorkItems> = yield call(fetchWorkItems, activeWorkItem.project!, wiql, settings.top);
            yield put(RelatedWorkItemActions.loadSucceeded(workItemId, workItems));
        } catch (e) {
            yield put(RelatedWorkItemActions.loadFailed(workItemId, e.message));
        }
    }
}

function* loadSettings(project: string, workItemTypeName: string) {
    const status: RT<typeof getRelatedWitsStatus> = yield select(getSettingsStatus);
    const settings: RT<typeof getSettings> = yield select(getSettings);

    if (!settings && status === LoadStatus.NotLoaded) {
        yield put(RelatedWorkItemSettingsActions.beginLoad());
        const settings: RT<typeof fetchSettings> = yield call(fetchSettings, project, workItemTypeName);
        yield put(RelatedWorkItemSettingsActions.loadSucceeded(settings));
    }
}

async function getActiveWorkItem(): Promise<IActiveWorkItemState> {
    const formService = await getWorkItemFormService();
    const [isNew, id, rev, links, relationTypes, fields, fieldValues] = await Promise.all([
        formService.isNew(),
        formService.getId(),
        formService.getRevision(),
        formService.getWorkItemRelations(),
        formService.getWorkItemRelationTypes(),
        formService.getFields(),
        formService.getFieldValues([CoreFieldRefNames.TeamProject, CoreFieldRefNames.WorkItemType])
    ]);

    const project = fieldValues[CoreFieldRefNames.TeamProject] as string;
    const workItemTypeName = fieldValues[CoreFieldRefNames.WorkItemType] as string;
    const sortableFields = fields
        .filter(
            field => SortableFieldTypes.indexOf(field.type) !== -1 && !contains(ExcludedFields, field.referenceName, (f1, f2) => equals(f1, f2, true))
        )
        .sort(fieldNameComparer);

    const queryableFields = fields.filter(
        field =>
            (QueryableFieldTypes.indexOf(field.type) !== -1 || equals(field.referenceName, "System.Tags", true)) &&
            !contains(ExcludedFields, field.referenceName, (f1, f2) => equals(f1, f2, true))
    );

    return {
        id: id,
        rev: rev,
        project: project,
        workItemTypeName: workItemTypeName,
        isNew: isNew,
        links: links,
        relationTypes: relationTypes,
        queryableFields: queryableFields,
        sortableFields: sortableFields
    };
}
