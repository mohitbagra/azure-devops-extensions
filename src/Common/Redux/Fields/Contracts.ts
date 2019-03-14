import {
    WorkItemField, WorkItemTypeFieldWithReferences
} from "azure-devops-extension-api/WorkItemTracking";

export interface IFieldAwareState {
    fieldState: IFieldState;
}

export interface IFieldState {
    fields?: WorkItemField[];
    fieldsMap?: { [nameOrRefName: string]: WorkItemField };
    loading: boolean;
    error?: string;
    workItemTypeFieldsMap: { [workItemTypeName: string]: IWorkItemTypeFields };
}

export interface IWorkItemTypeFields {
    workItemTypeName: string;
    loading: boolean;
    fields?: WorkItemTypeFieldWithReferences[];
    fieldsMap?: { [nameOrRefName: string]: WorkItemTypeFieldWithReferences };
    error?: string;
}

export const defaultState: IFieldState = {
    loading: false,
    workItemTypeFieldsMap: {}
};
