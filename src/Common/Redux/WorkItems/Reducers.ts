import { WorkItemActions, WorkItemActionTypes } from "Common/Redux/WorkItems/Actions";
import {
    defaultState, IWorkItem, IWorkItemState, WorkItemStatus
} from "Common/Redux/WorkItems/Contracts";
import { produce } from "immer";

export function workItemReducer(state: IWorkItemState | undefined, action: WorkItemActions): IWorkItemState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case WorkItemActionTypes.BeginLoad: {
                const workItemIds = action.payload;
                for (const id of workItemIds) {
                    draft.workItemsMap[id] = {
                        id: id,
                        status: WorkItemStatus.Loading
                    } as IWorkItem;
                }
                break;
            }

            case WorkItemActionTypes.LoadFailed: {
                for (const pair of action.payload) {
                    const { workItemId, error } = pair;
                    draft.workItemsMap[workItemId].status = WorkItemStatus.LoadFailed;
                    draft.workItemsMap[workItemId].error = error;
                }
                break;
            }

            case WorkItemActionTypes.LoadSucceeded: {
                const workItems = action.payload;
                for (const workItem of workItems) {
                    draft.workItemsMap[workItem.id] = {
                        ...workItem,
                        status: WorkItemStatus.Loaded,
                        error: undefined
                    };
                }
            }
        }
    });
}
