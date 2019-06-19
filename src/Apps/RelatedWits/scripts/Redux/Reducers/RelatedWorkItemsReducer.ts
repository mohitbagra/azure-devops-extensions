import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { RelatedWorkItemActions, RelatedWorkItemActionTypes } from "../Actions";
import { defaultRelatedWorkItemsState, IRelatedWorkItemsState } from "../Contracts";

export function relatedWorkItemsReducer(state: IRelatedWorkItemsState | undefined, action: RelatedWorkItemActions): IRelatedWorkItemsState {
    return produce(state || defaultRelatedWorkItemsState, draft => {
        switch (action.type) {
            case RelatedWorkItemActionTypes.BeginLoad: {
                const workItemId = action.payload;

                draft.relatedWorkItems[workItemId] = {
                    status: LoadStatus.Loading,
                    workItemId
                };
                break;
            }

            case RelatedWorkItemActionTypes.LoadFailed: {
                const { error, workItemId } = action.payload;

                draft.relatedWorkItems[workItemId] = {
                    status: LoadStatus.LoadFailed,
                    workItemId,
                    error
                };
                break;
            }

            case RelatedWorkItemActionTypes.LoadSucceeded: {
                const { workItems, workItemId } = action.payload;

                draft.relatedWorkItems[workItemId] = {
                    status: LoadStatus.Ready,
                    workItemId,
                    workItems,
                    error: undefined
                };
                break;
            }

            case RelatedWorkItemActionTypes.ApplyFilter: {
                draft.filterState = action.payload;
                break;
            }

            case RelatedWorkItemActionTypes.ApplySort: {
                draft.sortState = action.payload;
                break;
            }

            case RelatedWorkItemActionTypes.UpdateRelatedWorkItem: {
                const relatedWorkItem = action.payload;
                for (const id of Object.keys(draft.relatedWorkItems)) {
                    const wis = draft.relatedWorkItems[parseInt(id)];
                    if (wis && wis.workItems) {
                        const index = wis.workItems.findIndex(w => w.id === relatedWorkItem.id);
                        if (index > -1) {
                            wis.workItems[index] = relatedWorkItem;
                        }
                    }
                }

                break;
            }
        }
    });
}
