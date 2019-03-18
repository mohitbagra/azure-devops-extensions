import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { IWorkItemRelationTypeAwareState, IWorkItemRelationTypeState } from "./Contracts";

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

export const getWorkItemRelationTypesMap = createSelector(
    getWorkItemRelationTypeState,
    (state: IWorkItemRelationTypeState | undefined) => state && state.relationTypesMap
);

export const getWorkItemRelationTypesStatus = createSelector(
    getWorkItemRelationTypeState,
    (state: IWorkItemRelationTypeState | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getWorkItemRelationTypesError = createSelector(
    getWorkItemRelationTypeState,
    (state: IWorkItemRelationTypeState | undefined) => state && state.error
);
