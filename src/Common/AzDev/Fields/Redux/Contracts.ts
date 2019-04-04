import { WorkItemField, WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";

export interface IFieldAwareState {
    fieldState: IFieldState;
    workItemTypeFieldState: IWorkItemTypeFieldState;
}

export interface IFieldState {
    fields?: WorkItemField[];
    fieldsMap?: { [nameOrRefName: string]: WorkItemField };
    status: LoadStatus;
    error?: string;
}

export interface IWorkItemTypeFieldState {
    workItemTypeFieldsMap: { [workItemTypeName: string]: IWorkItemTypeFields };
}

export interface IWorkItemTypeFields {
    workItemTypeName: string;
    status: LoadStatus;
    fields?: WorkItemTypeFieldWithReferences[];
    fieldsMap?: { [nameOrRefName: string]: WorkItemTypeFieldWithReferences };
    error?: string;
}

export const defaultFieldState: IFieldState = {
    status: LoadStatus.NotLoaded
};

export const defaultWorkItemTypeFieldState: IWorkItemTypeFieldState = {
    workItemTypeFieldsMap: {}
};
