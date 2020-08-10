import { LoadStatus } from "Common/Contracts";
import { toDictionary } from "Common/Utilities/Array";
import { produce } from "immer";

import { WorkItemTypeStateActions, WorkItemTypeStateActionTypes } from "./Actions";
import { defaultState, IWorkItemTypeStateState } from "./Contracts";

export function workItemTypeStateReducer(state: IWorkItemTypeStateState | undefined, action: WorkItemTypeStateActions): IWorkItemTypeStateState {
    return produce(state || defaultState, (draft) => {
        switch (action.type) {
            case WorkItemTypeStateActionTypes.BeginLoad: {
                const workItemTypeName = action.payload;
                draft.statesMap[workItemTypeName.toLowerCase()] = {
                    workItemTypeName: workItemTypeName,
                    status: LoadStatus.Loading
                };
                break;
            }

            case WorkItemTypeStateActionTypes.LoadFailed: {
                const { workItemTypeName, error } = action.payload;
                draft.statesMap[workItemTypeName.toLowerCase()].error = error;
                draft.statesMap[workItemTypeName.toLowerCase()].status = LoadStatus.LoadFailed;
                break;
            }

            case WorkItemTypeStateActionTypes.LoadSucceeded: {
                const { workItemTypeName, stateColors } = action.payload;
                draft.statesMap[workItemTypeName.toLowerCase()] = {
                    status: LoadStatus.Ready,
                    workItemTypeName: workItemTypeName,
                    stateColors: toDictionary(
                        stateColors,
                        (s) => s.name.toLowerCase(),
                        (s) => s.color
                    )
                };
            }
        }
    });
}
