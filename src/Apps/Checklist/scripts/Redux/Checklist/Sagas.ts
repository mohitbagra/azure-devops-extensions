import { equals } from "azure-devops-ui/Core/Util/String";
import { WorkItemFormActions, WorkItemFormActionTypes } from "Common/AzDev/WorkItemForm/Redux/Actions";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { getWorkItemProjectId, getWorkItemTypeName } from "Common/ServiceWrappers/WorkItemFormServices";
import { getCurrentUser } from "Common/Utilities/Identity";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { all, call, put, select, takeEvery, takeLeading } from "redux-saga/effects";

import { ChecklistItemState, ChecklistType, IChecklist, IChecklistItem, IGroupedChecklists } from "../../Interfaces";
import { ChecklistActions, ChecklistActionTypes } from "./Actions";
import { fetchWorkItemChecklistAsync, fetchWorkItemDefaultChecklist, fetchWorkItemTypeChecklistAsync, updateChecklistAsync } from "./DataSources";
import { getChecklist, getChecklistStatus } from "./Selectors";

export function* checklistSaga() {
    yield takeEvery(ChecklistActionTypes.ChecklistLoadRequested, loadChecklist);
    yield takeEvery(WorkItemFormActionTypes.WorkItemRefreshed, onWorkItemRefresh);
    yield takeLeading(
        [ChecklistActionTypes.ChecklistItemCreateRequested, ChecklistActionTypes.ChecklistItemUpdateRequested],
        addOrUpdateChecklistItem
    );
    yield takeLeading(ChecklistActionTypes.ChecklistItemDeleteRequested, deleteChecklistItem);
    yield takeLeading(ChecklistActionTypes.ChecklistItemReorderRequested, reorderChecklistItem);
}

function* loadChecklist(action: ActionsOfType<ChecklistActions, ChecklistActionTypes.ChecklistLoadRequested>) {
    yield call(refreshChecklist, action.payload);
}

function* onWorkItemRefresh(action: ActionsOfType<WorkItemFormActions, WorkItemFormActionTypes.WorkItemRefreshed>) {
    yield call(refreshChecklist, action.payload.id);
}

function* addOrUpdateChecklistItem(
    action: ActionsOfType<ChecklistActions, ChecklistActionTypes.ChecklistItemCreateRequested | ChecklistActionTypes.ChecklistItemUpdateRequested>
) {
    const { idOrType, checklistItem, checklistType } = action.payload;
    const status: RT<typeof getChecklistStatus> = yield select(getChecklistStatus, idOrType);

    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed || status === LoadStatus.LoadFailed) {
        const checklist: RT<typeof getChecklist> = yield select(getChecklist, idOrType, checklistType);

        if (checklist) {
            let needsUpdate = true;
            let newChecklistItems = [...checklist.checklistItems];

            if (isNullOrWhiteSpace(checklistItem.id)) {
                newChecklistItems = newChecklistItems.concat({ ...checklistItem, id: `${Date.now()}` });
            } else {
                const index = newChecklistItems.findIndex((item) => equals(item.id, checklistItem.id, true));
                if (index !== -1) {
                    const stateChanged = newChecklistItems[index].state !== checklistItem.state;

                    newChecklistItems[index] = {
                        ...newChecklistItems[index],
                        text: checklistItem.text,
                        required: checklistItem.required,
                        state: checklistItem.state,
                        labels: checklistItem.labels
                    };
                    if (stateChanged) {
                        if (checklistItem.state === ChecklistItemState.Completed) {
                            newChecklistItems[index].completedBy = getCurrentUser();
                            newChecklistItems[index].completedDate = new Date();
                        } else {
                            newChecklistItems[index].completedBy = undefined;
                            newChecklistItems[index].completedDate = undefined;
                        }
                    }
                } else {
                    needsUpdate = false;
                }
            }

            if (needsUpdate) {
                yield call(
                    updateChecklist,
                    idOrType,
                    {
                        ...checklist,
                        checklistItems: newChecklistItems
                    },
                    checklistType
                );
            }
        }
    }
}

function* deleteChecklistItem(action: ActionsOfType<ChecklistActions, ChecklistActionTypes.ChecklistItemDeleteRequested>) {
    const { idOrType, checklistItemId, checklistType } = action.payload;
    const status: RT<typeof getChecklistStatus> = yield select(getChecklistStatus, idOrType);

    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed || status === LoadStatus.LoadFailed) {
        const checklist: RT<typeof getChecklist> = yield select(getChecklist, idOrType, checklistType);

        if (checklist) {
            const newChecklistItems = checklist.checklistItems.filter((item) => !equals(item.id, checklistItemId, true));
            if (newChecklistItems.length < checklist.checklistItems.length) {
                yield call(
                    updateChecklist,
                    idOrType,
                    {
                        ...checklist,
                        checklistItems: newChecklistItems
                    },
                    checklistType
                );
            }
        }
    }
}

function* reorderChecklistItem(action: ActionsOfType<ChecklistActions, ChecklistActionTypes.ChecklistItemReorderRequested>) {
    const { idOrType, checklistItemId, checklistType, newIndex } = action.payload;
    const status: RT<typeof getChecklistStatus> = yield select(getChecklistStatus, idOrType);

    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed || status === LoadStatus.LoadFailed) {
        const checklist: RT<typeof getChecklist> = yield select(getChecklist, idOrType, checklistType);

        if (checklist) {
            const checklistItemIndex = checklist.checklistItems.findIndex((item) => equals(item.id, checklistItemId, true));
            if (checklistItemIndex !== -1) {
                const item = checklist.checklistItems[checklistItemIndex];
                const newChecklistItems = [...checklist.checklistItems];
                newChecklistItems.splice(checklistItemIndex, 1);
                newChecklistItems.splice(newIndex, 0, item);

                yield call(
                    updateChecklist,
                    idOrType,
                    {
                        ...checklist,
                        checklistItems: newChecklistItems
                    },
                    checklistType
                );
            }
        }
    }
}

function* refreshChecklist(idOrType: number | string) {
    const status: RT<typeof getChecklistStatus> = yield select(getChecklistStatus, idOrType);

    if (status !== LoadStatus.Loading && status !== LoadStatus.Updating) {
        yield put(ChecklistActions.beginLoadChecklist(idOrType));
        let groupedChecklists: IGroupedChecklists;

        if (typeof idOrType === "number") {
            const [workItemTypeName, workItemProjectId]: [RT<typeof getWorkItemTypeName>, RT<typeof getWorkItemProjectId>] = yield all([
                call(getWorkItemTypeName),
                call(getWorkItemProjectId)
            ]);

            const [personalChecklist, sharedChecklist, witDefaultChecklist, workItemTypeChecklist]: [
                RT<typeof fetchWorkItemChecklistAsync>,
                RT<typeof fetchWorkItemChecklistAsync>,
                RT<typeof fetchWorkItemDefaultChecklist>,
                RT<typeof fetchWorkItemTypeChecklistAsync>
            ] = yield all([
                call(fetchWorkItemChecklistAsync, idOrType, true),
                call(fetchWorkItemChecklistAsync, idOrType, false),
                call(fetchWorkItemDefaultChecklist, idOrType),
                call(fetchWorkItemTypeChecklistAsync, workItemTypeName, workItemProjectId)
            ]);

            groupedChecklists = {
                personalChecklist: personalChecklist,
                sharedChecklist: sharedChecklist,
                witDefaultChecklist: mergeDefaultChecklists(workItemTypeChecklist, witDefaultChecklist)
            };
        } else {
            const workItemTypeChecklist: RT<typeof fetchWorkItemTypeChecklistAsync> = yield call(fetchWorkItemTypeChecklistAsync, idOrType);
            groupedChecklists = {
                personalChecklist: { id: idOrType, checklistItems: [] },
                sharedChecklist: { id: idOrType, checklistItems: [] },
                witDefaultChecklist: workItemTypeChecklist
            };
        }

        yield put(ChecklistActions.checklistLoaded(idOrType, groupedChecklists));
    }
}

function* updateChecklist(idOrType: number | string, newChecklist: IChecklist, checklistType: ChecklistType) {
    yield put(ChecklistActions.beginUpdateChecklist(idOrType, newChecklist, checklistType));
    try {
        const updatedChecklist: RT<typeof updateChecklistAsync> = yield call(
            updateChecklistAsync,
            newChecklist,
            checklistType,
            typeof idOrType === "string"
        );
        yield put(ChecklistActions.checklistUpdated(idOrType, updatedChecklist, checklistType));
    } catch (e) {
        yield put(ChecklistActions.checklistUpdateFailed(idOrType, e.message));
    }
}

function mergeDefaultChecklists(workItemTypeChecklist: IChecklist, workItemChecklist: IChecklist): IChecklist {
    const mergedChecklist: IChecklist = { ...workItemChecklist, checklistItems: [] };

    const workItemChecklistItemsMap: { [key: string]: IChecklistItem } = {};
    for (const checklistItem of workItemChecklist.checklistItems) {
        workItemChecklistItemsMap[checklistItem.id.toLowerCase()] = checklistItem;
    }

    for (const checklistItem of workItemTypeChecklist.checklistItems) {
        const key = checklistItem.id.toLowerCase();
        if (workItemChecklistItemsMap[key] == null) {
            mergedChecklist.checklistItems.push(checklistItem);
        } else {
            const workItemChecklistItem = workItemChecklistItemsMap[key];
            mergedChecklist.checklistItems.push({
                ...workItemChecklistItem,
                text: checklistItem.text,
                required: checklistItem.required,
                labels: checklistItem.labels
            });
        }
    }

    return mergedChecklist;
}
