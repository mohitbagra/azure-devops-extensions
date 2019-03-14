import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const WorkItemActions = {
    loadRequested: (workItemIds: number[], projectIdOrName?: string) =>
        createAction(WorkItemActionTypes.LoadRequested, { workItemIds, projectIdOrName }),
    beginLoad: (workItemIds: number[]) => createAction(WorkItemActionTypes.BeginLoad, workItemIds),
    loadSucceeded: (workItems: WorkItem[]) => createAction(WorkItemActionTypes.LoadSucceeded, workItems),
    loadFailed: (payload: { workItemId: number; error: string }[]) => createAction(WorkItemActionTypes.LoadFailed, payload)
};

export const enum WorkItemActionTypes {
    LoadRequested = "WorkItems/LoadRequested",
    BeginLoad = "WorkItems/BeginLoad",
    LoadSucceeded = "WorkItems/LoadSucceeded",
    LoadFailed = "WorkItems/LoadFailed"
}

export type WorkItemActions = ActionsUnion<typeof WorkItemActions>;
