import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ActionsUnion, createAction } from "Common/Redux";

export const WorkItemTypeActions = {
    loadRequested: () => createAction(WorkItemTypeActionTypes.LoadRequested),
    beginLoad: () => createAction(WorkItemTypeActionTypes.BeginLoad),
    loadSucceeded: (workItemTypes: WorkItemType[]) => createAction(WorkItemTypeActionTypes.LoadSucceeded, workItemTypes),
    loadFailed: (error: string) => createAction(WorkItemTypeActionTypes.LoadFailed, error)
};

export const enum WorkItemTypeActionTypes {
    LoadRequested = "WorkItemTypes/LoadRequested",
    BeginLoad = "WorkItemTypes/BeginLoad",
    LoadSucceeded = "WorkItemTypes/LoadSucceeded",
    LoadFailed = "WorkItemTypes/LoadFailed"
}

export type WorkItemTypeActions = ActionsUnion<typeof WorkItemTypeActions>;
