import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { IWorkItemTypeAwareState, IWorkItemTypeState } from "Common/Redux/WorkItemTypes/Contracts";
import { createSelector } from "reselect";

export function getWorkItemTypeState(state: IWorkItemTypeAwareState): IWorkItemTypeState | undefined {
    return state.workItemTypeState;
}

export function getWorkItemType(state: IWorkItemTypeAwareState, workItemTypeName: string): WorkItemType | undefined {
    const workItemTypeState = getWorkItemTypeState(state);
    return workItemTypeState && workItemTypeState.workItemTypesMap && workItemTypeState.workItemTypesMap[workItemTypeName.toLowerCase()];
}

export const getWorkItemTypesMap = createSelector(
    getWorkItemTypeState,
    (state: IWorkItemTypeState | undefined) => state && state.workItemTypesMap
);

export const getWorkItemTypes = createSelector(
    getWorkItemTypeState,
    (state: IWorkItemTypeState | undefined) => state && state.workItemTypes
);

export const getWorkItemTypesStatus = createSelector(
    getWorkItemTypeState,
    (state: IWorkItemTypeState | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getWorkItemTypesError = createSelector(
    getWorkItemTypeState,
    (state: IWorkItemTypeState | undefined) => state && state.error
);
