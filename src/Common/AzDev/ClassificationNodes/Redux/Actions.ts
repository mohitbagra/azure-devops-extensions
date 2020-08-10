import { WorkItemClassificationNode } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ActionsUnion, createAction } from "Common/Redux";

export const enum AreaPathActionTypes {
    LoadRequested = "AreaPaths/LoadRequested",
    BeginLoad = "AreaPaths/BeginLoad",
    LoadSucceeded = "AreaPaths/LoadSucceeded",
    LoadFailed = "AreaPaths/LoadFailed"
}

export const enum IterationPathActionTypes {
    LoadRequested = "IterationPaths/LoadRequested",
    BeginLoad = "IterationPaths/BeginLoad",
    LoadSucceeded = "IterationPaths/LoadSucceeded",
    LoadFailed = "IterationPaths/LoadFailed"
}

export const AreaPathActions = {
    loadRequested: () => createAction(AreaPathActionTypes.LoadRequested),
    beginLoad: () => createAction(AreaPathActionTypes.BeginLoad),
    loadSucceeded: (rootNode: WorkItemClassificationNode) => createAction(AreaPathActionTypes.LoadSucceeded, rootNode),
    loadFailed: (error: string) => createAction(AreaPathActionTypes.LoadFailed, error)
};

export const IterationPathActions = {
    loadRequested: () => createAction(IterationPathActionTypes.LoadRequested),
    beginLoad: () => createAction(IterationPathActionTypes.BeginLoad),
    loadSucceeded: (rootNode: WorkItemClassificationNode) => createAction(IterationPathActionTypes.LoadSucceeded, rootNode),
    loadFailed: (error: string) => createAction(IterationPathActionTypes.LoadFailed, error)
};

export type AreaPathActions = ActionsUnion<typeof AreaPathActions>;
export type IterationPathActions = ActionsUnion<typeof IterationPathActions>;
