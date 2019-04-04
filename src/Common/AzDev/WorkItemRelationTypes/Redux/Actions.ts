import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ActionsUnion, createAction } from "Common/Redux";

export const WorkItemRelationTypeActions = {
    loadRequested: () => createAction(WorkItemRelationTypeActionTypes.LoadRequested),
    beginLoad: () => createAction(WorkItemRelationTypeActionTypes.BeginLoad),
    loadSucceeded: (relationTypes: WorkItemRelationType[]) => createAction(WorkItemRelationTypeActionTypes.LoadSucceeded, relationTypes),
    loadFailed: (error: string) => createAction(WorkItemRelationTypeActionTypes.LoadFailed, error)
};

export const enum WorkItemRelationTypeActionTypes {
    LoadRequested = "WorkItemRelationTypes/LoadRequested",
    BeginLoad = "WorkItemRelationTypes/BeginLoad",
    LoadSucceeded = "WorkItemRelationTypes/LoadSucceeded",
    LoadFailed = "WorkItemRelationTypes/LoadFailed"
}

export type WorkItemRelationTypeActions = ActionsUnion<typeof WorkItemRelationTypeActions>;
