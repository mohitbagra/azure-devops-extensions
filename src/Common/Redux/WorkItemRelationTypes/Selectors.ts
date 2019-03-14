import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking";
import {
    IWorkItemRelationTypeAwareState, IWorkItemRelationTypeState
} from "Common/Redux/WorkItemRelationTypes/Contracts";
import { createSelector } from "reselect";

export function getWorkItemRelationTypeState(state: IWorkItemRelationTypeAwareState): IWorkItemRelationTypeState | undefined {
    return state.workItemRelationTypeState;
}

export function getWorkItemRelationType(state: IWorkItemRelationTypeAwareState, nameOrRefName: string): WorkItemRelationType | undefined {
    const workItemRelationTypeState = getWorkItemRelationTypeState(state);
    return (
        workItemRelationTypeState &&
        workItemRelationTypeState.relationTypesMap &&
        workItemRelationTypeState.relationTypesMap[nameOrRefName.toLowerCase()]
    );
}

export const getWorkItemRelationTypes = createSelector(
    getWorkItemRelationTypeState,
    (state: IWorkItemRelationTypeState | undefined) => state && state.relationTypes
);

export const areWorkItemRelationTypesLoading = createSelector(
    getWorkItemRelationTypeState,
    (state: IWorkItemRelationTypeState | undefined) => !!(state && state.loading)
);
