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

export const getAreaPathRootNode = createSelector(
    getAreaPathState,
    (state: IClassificationNodeState | undefined) => state && state.rootNode
);
export const getIterationPathRootNode = createSelector(
    getIterationPathState,
    (state: IClassificationNodeState | undefined) => state && state.rootNode
);

export const areAreaPathsLoading = createSelector(
    getAreaPathState,
    (state: IClassificationNodeState | undefined) => !!(state && state.loading)
);
export const areIterationPathsLoading = createSelector(
    getIterationPathState,
    (state: IClassificationNodeState | undefined) => !!(state && state.loading)
);
