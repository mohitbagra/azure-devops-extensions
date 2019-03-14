import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import { resolveProjectId } from "Common/Utilities/WebContext";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { ActionsOfType } from "../Helpers";
import { WorkItemActions, WorkItemActionTypes } from "./Actions";
import { IWorkItem } from "./Contracts";
import { fetchWorkItems } from "./DataSource";
import { getWorkItemsArr } from "./Selectors";

export function* workItemsSaga(): SagaIterator {
    yield takeEvery(WorkItemActionTypes.LoadRequested, loadWorkItems);
}

function* loadWorkItems(action: ActionsOfType<WorkItemActions, WorkItemActionTypes.LoadRequested>): SagaIterator {
    const { workItemIds, projectIdOrName } = action.payload;
    let workItems: IWorkItem[] | undefined = yield select(getWorkItemsArr);
    workItems = workItems || [];
    const existingWorkItemIds = workItems.map(w => w.id);
    const missingWorkItemIds = workItemIds.filter(id => existingWorkItemIds.indexOf(id) === -1);

    if (missingWorkItemIds.length > 0) {
        yield put(WorkItemActions.beginLoad(missingWorkItemIds));
        try {
            const projectId: string = yield call(resolveProjectId, projectIdOrName);
            const data: WorkItem[] = yield call(fetchWorkItems, missingWorkItemIds, projectId);
            yield put(WorkItemActions.loadSucceeded(data));
        } catch (error) {
            yield put(
                WorkItemActions.loadFailed(
                    missingWorkItemIds.map(id => ({
                        workItemId: id,
                        error: error.message || error
                    }))
                )
            );
        }
    }
}
