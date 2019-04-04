import { WorkItemField, WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ActionsUnion, createAction } from "Common/Redux";

export const FieldActions = {
    loadRequested: () => createAction(FieldActionTypes.LoadRequested),
    beginLoad: () => createAction(FieldActionTypes.BeginLoad),
    loadSucceeded: (fields: WorkItemField[]) => createAction(FieldActionTypes.LoadSucceeded, fields),
    loadFailed: (error: string) => createAction(FieldActionTypes.LoadFailed, error)
};

export const enum FieldActionTypes {
    LoadRequested = "Fields/LoadRequested",
    BeginLoad = "Fields/BeginLoad",
    LoadSucceeded = "Fields/LoadSucceeded",
    LoadFailed = "Fields/LoadFailed"
}

export const WorkItemTypeFieldActions = {
    loadRequested: (workItemTypeName: string) => createAction(WorkItemTypeFieldActionTypes.LoadRequested, workItemTypeName),
    beginLoad: (workItemTypeName: string) => createAction(WorkItemTypeFieldActionTypes.BeginLoad, workItemTypeName),
    loadSucceeded: (workItemTypeName: string, fields: WorkItemTypeFieldWithReferences[]) =>
        createAction(WorkItemTypeFieldActionTypes.LoadSucceeded, { workItemTypeName, fields }),
    loadFailed: (workItemTypeName: string, error: string) => createAction(WorkItemTypeFieldActionTypes.LoadFailed, { workItemTypeName, error })
};

export const enum WorkItemTypeFieldActionTypes {
    LoadRequested = "WorkItemTypeFields/LoadRequested",
    BeginLoad = "WorkItemTypeFields/BeginLoad",
    LoadSucceeded = "WorkItemTypeFields/LoadSucceeded",
    LoadFailed = "WorkItemTypeFields/LoadFailed"
}

export type WorkItemTypeFieldActions = ActionsUnion<typeof WorkItemTypeFieldActions>;
export type FieldActions = ActionsUnion<typeof FieldActions>;
