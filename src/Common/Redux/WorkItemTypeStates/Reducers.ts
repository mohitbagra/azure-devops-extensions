import {
    WorkItemTypeStateActions, WorkItemTypeStateActionTypes
} from "Common/Redux/WorkItemTypeStates/Actions";
import { defaultState, IWorkItemTypeStateState } from "Common/Redux/WorkItemTypeStates/Contracts";
import { toDictionary } from "Common/Utilities/Array";
import { produce } from "immer";

export function workItemTypeStateReducer(state: IWorkItemTypeStateState | undefined, action: WorkItemTypeStateActions): IWorkItemTypeStateState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case WorkItemTypeStateActionTypes.BeginLoad: {
                const workItemTypeName = action.payload;
                draft.statesMap[workItemTypeName.toLowerCase()] = {
                    workItemTypeName: workItemTypeName,
                    loading: true
                };
                break;
            }

            case WorkItemTypeStateActionTypes.LoadFailed: {
                const { workItemTypeName, error } = action.payload;
                draft.statesMap[workItemTypeName.toLowerCase()].error = error;
                draft.statesMap[workItemTypeName.toLowerCase()].loading = false;
                break;
            }

            case WorkItemTypeStateActionTypes.LoadSucceeded: {
                const { workItemTypeName, stateColors } = action.payload;
                draft.statesMap[workItemTypeName.toLowerCase()] = {
                    loading: false,
                    workItemTypeName: workItemTypeName,
                    stateColors: toDictionary(stateColors, s => s.name.toLowerCase(), s => s.color)
                };
            }
        }
    });
}
