import { WorkItemTypeActions, WorkItemTypeActionTypes } from "Common/Redux/WorkItemTypes/Actions";
import { defaultState, IWorkItemTypeState } from "Common/Redux/WorkItemTypes/Contracts";
import { toDictionary } from "Common/Utilities/Array";
import { produce } from "immer";

export function workItemTypeReducer(state: IWorkItemTypeState | undefined, action: WorkItemTypeActions): IWorkItemTypeState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case WorkItemTypeActionTypes.BeginLoad: {
                draft.loading = true;
                draft.workItemTypes = undefined;
                draft.workItemTypesMap = undefined;
                draft.error = undefined;
                break;
            }

            case WorkItemTypeActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.workItemTypes = undefined;
                draft.workItemTypesMap = undefined;
                draft.loading = false;
                break;
            }

            case WorkItemTypeActionTypes.LoadSucceeded: {
                const workItemTypes = action.payload;
                draft.workItemTypes = workItemTypes;
                draft.workItemTypesMap = toDictionary(workItemTypes, w => w.name.toLowerCase(), w => w);
                draft.loading = false;
                draft.error = undefined;
            }
        }
    });
}
