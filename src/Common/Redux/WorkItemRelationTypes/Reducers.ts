import {
    WorkItemRelationTypeActions, WorkItemRelationTypeActionTypes
} from "Common/Redux/WorkItemRelationTypes/Actions";
import {
    defaultState, IWorkItemRelationTypeState
} from "Common/Redux/WorkItemRelationTypes/Contracts";
import { produce } from "immer";

export function workItemRelationTypeReducer(
    state: IWorkItemRelationTypeState | undefined,
    action: WorkItemRelationTypeActions
): IWorkItemRelationTypeState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case WorkItemRelationTypeActionTypes.BeginLoad: {
                draft.loading = true;
                draft.relationTypes = undefined;
                draft.relationTypesMap = undefined;
                draft.error = undefined;
                break;
            }

            case WorkItemRelationTypeActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.relationTypes = undefined;
                draft.relationTypesMap = undefined;
                draft.loading = false;
                break;
            }

            case WorkItemRelationTypeActionTypes.LoadSucceeded: {
                const relationTypes = action.payload;
                draft.relationTypes = relationTypes;
                draft.relationTypesMap = {};
                for (const relationType of relationTypes) {
                    draft.relationTypesMap[relationType.name.toLowerCase()] = relationType;
                    draft.relationTypesMap[relationType.referenceName.toLowerCase()] = relationType;
                }
                draft.loading = false;
                draft.error = undefined;
            }
        }
    });
}
