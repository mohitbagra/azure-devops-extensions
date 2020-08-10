import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";

import { IWorkItemTypeStateAwareState, IWorkItemTypeStateColors, IWorkItemTypeStateState } from "./Contracts";

export function getWorkItemTypeStateState(state: IWorkItemTypeStateAwareState): IWorkItemTypeStateState | undefined {
    return state.workItemTypeStateState;
}

export function getWorkItemTypeStates(state: IWorkItemTypeStateAwareState, workItemTypeName: string): IWorkItemTypeStateColors | undefined {
    const workItemTypeStateState = getWorkItemTypeStateState(state);
    return workItemTypeStateState && workItemTypeStateState.statesMap && workItemTypeStateState.statesMap[workItemTypeName.toLowerCase()];
}

export function getWorkItemTypeStateColor(state: IWorkItemTypeStateAwareState, workItemTypeName: string, stateName: string): string | undefined {
    const states = getWorkItemTypeStates(state, workItemTypeName);
    return states && states.stateColors && states.stateColors[stateName.toLowerCase()];
}

export const getWorkItemTypeStatesStatus = createSelector(
    getWorkItemTypeStates,
    (states: IWorkItemTypeStateColors | undefined) => (states && states.status) || LoadStatus.NotLoaded
);

export const getWorkItemTypeStatesError = createSelector(
    getWorkItemTypeStates,
    (states: IWorkItemTypeStateColors | undefined) => states && states.error
);
