import { LoadStatus } from "Common/Contracts";
import { toDictionary } from "Common/Utilities/Array";
import { produce } from "immer";
import { WorkItemChecklistActions, WorkItemChecklistActionTypes } from "./Actions";
import { IWorkItemChecklistState } from "./Contracts";

const defaultState: IWorkItemChecklistState = {
    workItemChecklistsMap: {}
};

export function workItemChecklistReducer(state: IWorkItemChecklistState | undefined, action: WorkItemChecklistActions): IWorkItemChecklistState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case WorkItemChecklistActionTypes.BeginLoadWorkItemChecklist: {
                const workItemId = action.payload;

                if (draft.workItemChecklistsMap[workItemId]) {
                    draft.workItemChecklistsMap[workItemId].status = LoadStatus.Loading;
                } else {
                    draft.workItemChecklistsMap[workItemId] = {
                        status: LoadStatus.Loading
                    };
                }

                break;
            }

            case WorkItemChecklistActionTypes.WorkItemChecklistLoaded: {
                const { workItemChecklist, workItemId } = action.payload;
                draft.workItemChecklistsMap[workItemId] = {
                    status: LoadStatus.Ready,
                    checklist: workItemChecklist,
                    checklistItemsMap: toDictionary(workItemChecklist.checklistItems, item => item.id, item => item)
                };
                break;
            }

            case WorkItemChecklistActionTypes.BeginUpdateWorkItemChecklist: {
                const { workItemId, unSavedWorkItemChecklist } = action.payload;
                if (draft.workItemChecklistsMap[workItemId]) {
                    draft.workItemChecklistsMap[workItemId].status = LoadStatus.Updating;
                    draft.workItemChecklistsMap[workItemId].checklist = unSavedWorkItemChecklist;
                    draft.workItemChecklistsMap[workItemId].checklistItemsMap = toDictionary(
                        unSavedWorkItemChecklist.checklistItems,
                        item => item.id,
                        item => item
                    );
                }

                break;
            }

            case WorkItemChecklistActionTypes.WorkItemChecklistUpdateFailed: {
                const { workItemId, error } = action.payload;
                if (draft.workItemChecklistsMap[workItemId]) {
                    draft.workItemChecklistsMap[workItemId].status = LoadStatus.UpdateFailed;
                    draft.workItemChecklistsMap[workItemId].error = error;
                }

                break;
            }
        }
    });
}
