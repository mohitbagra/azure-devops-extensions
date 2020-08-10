import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";

import { IClassificationNode, IClassificationNodeAwareState, IClassificationNodeState } from "./Contracts";

export function getAreaPathState(state: IClassificationNodeAwareState): IClassificationNodeState | undefined {
    return state.areaPathState;
}

export function getIterationPathState(state: IClassificationNodeAwareState): IClassificationNodeState | undefined {
    return state.iterationPathState;
}

export function getAreaPathById(state: IClassificationNodeAwareState, nodeId: number): IClassificationNode | undefined {
    const areaPathState = getAreaPathState(state);
    return areaPathState && areaPathState.nodeMapById && areaPathState.nodeMapById[nodeId];
}

export function getIterationPathById(state: IClassificationNodeAwareState, nodeId: number): IClassificationNode | undefined {
    const iterationPathState = getIterationPathState(state);
    return iterationPathState && iterationPathState.nodeMapById && iterationPathState.nodeMapById[nodeId];
}

export function getAreaPathByPath(state: IClassificationNodeAwareState, path: string): IClassificationNode | undefined {
    const areaPathState = getAreaPathState(state);
    return areaPathState && areaPathState.nodeMapByPath && areaPathState.nodeMapByPath[path.toLowerCase()];
}

export function getIterationPathByPath(state: IClassificationNodeAwareState, path: string): IClassificationNode | undefined {
    const iterationPathState = getIterationPathState(state);
    return iterationPathState && iterationPathState.nodeMapByPath && iterationPathState.nodeMapByPath[path.toLowerCase()];
}

export const getAreaPathNodeMapById = createSelector(getAreaPathState, (state: IClassificationNodeState | undefined) => state && state.nodeMapById);

export const getAreaPathNodeMapByPath = createSelector(
    getAreaPathState,
    (state: IClassificationNodeState | undefined) => state && state.nodeMapByPath
);

export const getIterationPathNodeMapById = createSelector(
    getIterationPathState,
    (state: IClassificationNodeState | undefined) => state && state.nodeMapById
);

export const getIterationPathNodeMapByPath = createSelector(
    getIterationPathState,
    (state: IClassificationNodeState | undefined) => state && state.nodeMapByPath
);

export const getAreaPathRootNode = createSelector(getAreaPathState, (state: IClassificationNodeState | undefined) => state && state.rootNode);

export const getIterationPathRootNode = createSelector(
    getIterationPathState,
    (state: IClassificationNodeState | undefined) => state && state.rootNode
);

export const getAreaPathStatus = createSelector(
    getAreaPathState,
    (state: IClassificationNodeState | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getAreaPathError = createSelector(getAreaPathState, (state: IClassificationNodeState | undefined) => state && state.error);

export const getIterationPathStatus = createSelector(
    getIterationPathState,
    (state: IClassificationNodeState | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getIterationPathError = createSelector(getIterationPathState, (state: IClassificationNodeState | undefined) => state && state.error);
