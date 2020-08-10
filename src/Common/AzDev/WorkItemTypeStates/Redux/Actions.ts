import { WorkItemStateColor } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ActionsUnion, createAction } from "Common/Redux";

export const enum WorkItemTypeStateActionTypes {
    LoadRequested = "WorkItemTypeStates/LoadRequested",
    BeginLoad = "WorkItemTypeStates/BeginLoad",
    LoadSucceeded = "WorkItemTypeStates/LoadSucceeded",
    LoadFailed = "WorkItemTypeStates/LoadFailed"
}

export const WorkItemTypeStateActions = {
    loadRequested: (workItemTypeName: string) => createAction(WorkItemTypeStateActionTypes.LoadRequested, workItemTypeName),
    beginLoad: (workItemTypeName: string) => createAction(WorkItemTypeStateActionTypes.BeginLoad, workItemTypeName),
    loadSucceeded: (workItemTypeName: string, stateColors: WorkItemStateColor[]) =>
        createAction(WorkItemTypeStateActionTypes.LoadSucceeded, { workItemTypeName, stateColors }),
    loadFailed: (workItemTypeName: string, error: string) => createAction(WorkItemTypeStateActionTypes.LoadFailed, { workItemTypeName, error })
};

export type WorkItemTypeStateActions = ActionsUnion<typeof WorkItemTypeStateActions>;
