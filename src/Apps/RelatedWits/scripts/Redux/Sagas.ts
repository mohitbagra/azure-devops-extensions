import { equals } from "azure-devops-ui/Core/Util/String";
import { fetchBugBashDetailsAsync } from "BugBashPro/Shared/Redux/BugBashDetails/DataSource";
import { WorkItemFormActions, WorkItemFormActionTypes } from "Common/AzDev/WorkItemForm/Redux/Actions";
import { CoreFieldRefNames } from "Common/Constants";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { getWorkItemFormService } from "Common/ServiceWrappers/WorkItemFormServices";
import { contains } from "Common/Utilities/Array";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { ExcludedFields, QueryableFieldTypes, SortableFieldTypes } from "../Constants";
import { fieldNameComparer } from "../Helpers";
import { ActiveWorkItemActions, RelatedWorkItemActions, RelatedWorkItemActionTypes } from "./Actions";
import { IActiveWorkItemState } from "./Contracts";
import { getRelatedWitsStatus } from "./Selectors";

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
    const activeWorkItem = yield call(getActiveWorkItem);
    yield put(ActiveWorkItemActions.setActiveWorkItem(activeWorkItem));

    if (status !== LoadStatus.Loading) {
        yield put(RelatedWorkItemActions.beginLoad(workItemId));
        try {
            const workItems: RT<typeof fetchBugBashDetailsAsync> = yield call(fetchBugBashDetailsAsync, bugBashId);
            yield put(RelatedWorkItemActions.loadSucceeded(workItemId, workItems));
        } catch (e) {
            yield put(RelatedWorkItemActions.loadFailed(workItemId, e.message));
        }
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
