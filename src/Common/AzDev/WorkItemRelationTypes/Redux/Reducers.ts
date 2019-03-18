import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { WorkItemRelationTypeActions, WorkItemRelationTypeActionTypes } from "./Actions";
import { defaultState, IWorkItemRelationTypeState } from "./Contracts";

export function workItemRelationTypeReducer(
    state: IWorkItemRelationTypeState | undefined,
    action: WorkItemRelationTypeActions
): IWorkItemRelationTypeState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case WorkItemRelationTypeActionTypes.BeginLoad: {
                draft.status = LoadStatus.Loading;
                draft.relationTypes = undefined;
                draft.relationTypesMap = undefined;
                draft.error = undefined;
                break;
            }

            case WorkItemRelationTypeActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.relationTypes = undefined;
                draft.relationTypesMap = undefined;
                draft.status = LoadStatus.LoadFailed;
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
                draft.status = LoadStatus.Ready;
                draft.error = undefined;
            }
        }
    });
}
