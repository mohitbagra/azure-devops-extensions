import { resize } from "azure-devops-extension-sdk";
import { equals } from "azure-devops-ui/Core/Util/String";
import { IWorkItemChecklist } from "Checklist/Interfaces";
import { WorkItemFormActions, WorkItemFormActionTypes } from "Common/AzDev/WorkItemForm/Redux/Actions";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects";
import { WorkItemChecklistActions, WorkItemChecklistActionTypes } from "./Actions";
import { fetchWorkItemChecklistAsync, updateWorkItemChecklistAsync } from "./DataSources";
import { getWorkItemChecklist, getWorkItemChecklistStatus } from "./Selectors";

export function* workItemChecklistSaga() {
    yield takeEvery(WorkItemChecklistActionTypes.WorkItemChecklistLoadRequested, loadWorkItemChecklist);
    yield takeEvery(WorkItemFormActionTypes.WorkItemRefreshed, onWorkItemRefresh);
    yield takeLeading(
        [WorkItemChecklistActionTypes.WorkItemChecklistItemCreateRequested, WorkItemChecklistActionTypes.WorkItemChecklistItemUpdateRequested],
        addOrUpdateChecklistItem
    );
    yield takeLeading(WorkItemChecklistActionTypes.WorkItemChecklistItemDeleteRequested, deleteChecklistItem);
}

function* loadWorkItemChecklist(action: ActionsOfType<WorkItemChecklistActions, WorkItemChecklistActionTypes.WorkItemChecklistLoadRequested>) {
    yield call(refreshChecklist, action.payload);
}

function* onWorkItemRefresh(action: ActionsOfType<WorkItemFormActions, WorkItemFormActionTypes.WorkItemRefreshed>) {
    yield call(refreshChecklist, action.payload.id);
}

function* addOrUpdateChecklistItem(
    action: ActionsOfType<WorkItemChecklistActions, WorkItemChecklistActionTypes.WorkItemChecklistItemCreateRequested>
) {
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

            yield call(updateChecklist, workItemId, {
                ...checklist,
                checklistItems: newChecklistItems
            });
        }
    }
}

function* deleteChecklistItem(action: ActionsOfType<WorkItemChecklistActions, WorkItemChecklistActionTypes.WorkItemChecklistItemDeleteRequested>) {
    const { workItemId, checklistItemId } = action.payload;
    const status: RT<typeof getWorkItemChecklistStatus> = yield select(getWorkItemChecklistStatus, workItemId);

    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed || status === LoadStatus.LoadFailed) {
        const checklist: RT<typeof getWorkItemChecklist> = yield select(getWorkItemChecklist, workItemId);

        if (checklist) {
            const newChecklistItems = checklist.checklistItems.filter(item => !equals(item.id, checklistItemId, true));
            yield call(updateChecklist, workItemId, {
                ...checklist,
                checklistItems: newChecklistItems
            });
        }
    }
}

function* refreshChecklist(workItemId: number) {
    const status: RT<typeof getWorkItemChecklistStatus> = yield select(getWorkItemChecklistStatus, workItemId);

    if (status !== LoadStatus.Loading && status !== LoadStatus.Updating) {
        yield put(WorkItemChecklistActions.beginLoadWorkItemChecklist(workItemId));
        const checklist: RT<typeof fetchWorkItemChecklistAsync> = yield call(fetchWorkItemChecklistAsync, workItemId);
        yield put(WorkItemChecklistActions.workItemChecklistLoaded(workItemId, checklist));
        yield call(resizeIframe);
    }
}

function* updateChecklist(workItemId: number, newChecklist: IWorkItemChecklist) {
    yield put(WorkItemChecklistActions.beginUpdateWorkItemChecklist(workItemId, newChecklist));
    try {
        const updatedChecklist: RT<typeof updateWorkItemChecklistAsync> = yield call(updateWorkItemChecklistAsync, newChecklist);
        yield put(WorkItemChecklistActions.workItemChecklistLoaded(workItemId, updatedChecklist));
    } catch (e) {
        yield put(WorkItemChecklistActions.workItemChecklistUpdateFailed(workItemId, e.message));
    }

    yield call(resizeIframe);
}

function* resizeIframe() {
    const bodyElement = document.getElementsByTagName("body").item(0) as HTMLBodyElement;
    yield call(resize, undefined, bodyElement.scrollHeight);
}
