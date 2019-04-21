import { LoadStatus } from "Common/Contracts";
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
                draft.workItemChecklistsMap[workItemId] = {
                    status: LoadStatus.Loading
                };
                break;
            }
        }
    });
}
