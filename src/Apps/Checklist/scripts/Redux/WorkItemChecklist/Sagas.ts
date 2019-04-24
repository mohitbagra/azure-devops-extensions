import { equals } from "azure-devops-ui/Core/Util/String";
import { IWorkItemChecklist } from "Checklist/Interfaces";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { WorkItemChecklistActions, WorkItemChecklistActionTypes } from "./Actions";
import { fetchWorkItemChecklistAsync, updateWorkItemChecklistAsync } from "./DataSources";
import { getWorkItemChecklist, getWorkItemChecklistStatus } from "./Selectors";

export function* workItemChecklistSaga(): SagaIterator {
    yield takeLeading(WorkItemChecklistActionTypes.WorkItemChecklistLoadRequested, loadWorkItemChecklist);
    yield takeLeading(
        [WorkItemChecklistActionTypes.WorkItemChecklistItemCreateRequested, WorkItemChecklistActionTypes.WorkItemChecklistItemUpdateRequested],
        addOrUpdateChecklistItem
    );
    yield takeLeading(WorkItemChecklistActionTypes.WorkItemChecklistItemDeleteRequested, deleteChecklistItem);
}

function* loadWorkItemChecklist(
    action: ActionsOfType<WorkItemChecklistActions, WorkItemChecklistActionTypes.WorkItemChecklistLoadRequested>
): SagaIterator {
    const workItemId = action.payload;
    const status: RT<typeof getWorkItemChecklistStatus> = yield select(getWorkItemChecklistStatus, workItemId);

    if (status !== LoadStatus.Loading && status !== LoadStatus.Updating) {
        yield put(WorkItemChecklistActions.beginLoadWorkItemChecklist(workItemId));
        const checklist: RT<typeof fetchWorkItemChecklistAsync> = yield call(fetchWorkItemChecklistAsync, workItemId);
        yield put(WorkItemChecklistActions.workItemChecklistLoaded(workItemId, checklist));
    }
}

function* addOrUpdateChecklistItem(
    action: ActionsOfType<WorkItemChecklistActions, WorkItemChecklistActionTypes.WorkItemChecklistItemCreateRequested>
): SagaIterator {
    const { workItemId, checklistItem } = action.payload;
    const status: RT<typeof getWorkItemChecklistStatus> = yield select(getWorkItemChecklistStatus, workItemId);

    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed || status === LoadStatus.LoadFailed) {
        const checklist: RT<typeof getWorkItemChecklist> = yield select(getWorkItemChecklist, workItemId);

        if (checklist) {
            let newChecklistItems = [...checklist.checklistItems];
            const index = newChecklistItems.findIndex(item => equals(item.id, checklistItem.id, true));
            if (index === -1) {
                newChecklistItems = newChecklistItems.concat({ ...checklistItem, id: `${Date.now()}` });
            } else {
                newChecklistItems[index] = {
                    ...newChecklistItems[index],
                    text: checklistItem.text,
                    required: checklistItem.required,
                    state: checklistItem.state
                };
            }

            const unsavedChecklist: IWorkItemChecklist = {
                ...checklist,
                checklistItems: newChecklistItems
            };

            yield put(WorkItemChecklistActions.beginUpdateWorkItemChecklist(workItemId, unsavedChecklist));
            try {
                const updatedChecklist: RT<typeof updateWorkItemChecklistAsync> = yield call(updateWorkItemChecklistAsync, unsavedChecklist);
                yield put(WorkItemChecklistActions.workItemChecklistLoaded(workItemId, updatedChecklist));
            } catch (e) {
                yield put(WorkItemChecklistActions.workItemChecklistUpdateFailed(workItemId, e.message));
            }
        }
    }
}

function* deleteChecklistItem(
    action: ActionsOfType<WorkItemChecklistActions, WorkItemChecklistActionTypes.WorkItemChecklistItemDeleteRequested>
): SagaIterator {
    const { workItemId, checklistItemId } = action.payload;
    const status: RT<typeof getWorkItemChecklistStatus> = yield select(getWorkItemChecklistStatus, workItemId);

    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed || status === LoadStatus.LoadFailed) {
        const checklist: RT<typeof getWorkItemChecklist> = yield select(getWorkItemChecklist, workItemId);

        if (checklist) {
            const newChecklistItems = checklist.checklistItems.filter(item => !equals(item.id, checklistItemId, true));

            const unsavedChecklist: IWorkItemChecklist = {
                ...checklist,
                checklistItems: newChecklistItems
            };

            yield put(WorkItemChecklistActions.beginUpdateWorkItemChecklist(workItemId, unsavedChecklist));
            try {
                const updatedChecklist: RT<typeof updateWorkItemChecklistAsync> = yield call(updateWorkItemChecklistAsync, unsavedChecklist);
                yield put(WorkItemChecklistActions.workItemChecklistLoaded(workItemId, updatedChecklist));
            } catch (e) {
                yield put(WorkItemChecklistActions.workItemChecklistUpdateFailed(workItemId, e.message));
            }
        }
    }
}
