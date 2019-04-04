import { WorkItemField, WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { IFieldAwareState, IFieldState, IWorkItemTypeFields, IWorkItemTypeFieldState } from "./Contracts";

function getFieldState(state: IFieldAwareState): IFieldState | undefined {
    return state.fieldState;
}

function getWorkItemTypeFieldState(state: IFieldAwareState): IWorkItemTypeFieldState | undefined {
    return state.workItemTypeFieldState;
}

export function getField(state: IFieldAwareState, nameOrRefName: string): WorkItemField | undefined {
    const fieldState = getFieldState(state);
    return fieldState && fieldState.fieldsMap && fieldState.fieldsMap[nameOrRefName.toLowerCase()];
}

export const getFields = createSelector(
    getFieldState,
    (state: IFieldState | undefined) => state && state.fields
);

export const getFieldsMap = createSelector(
    getFieldState,
    (state: IFieldState | undefined) => state && state.fieldsMap
);

export const getFieldsStatus = createSelector(
    getFieldState,
    (state: IFieldState | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getFieldsError = createSelector(
    getFieldState,
    (state: IFieldState | undefined) => state && state.error
);

function getWorkItemTypeFieldsState(state: IFieldAwareState, workItemTypeName: string): IWorkItemTypeFields | undefined {
    const fieldState = getWorkItemTypeFieldState(state);
    return fieldState && fieldState.workItemTypeFieldsMap && fieldState.workItemTypeFieldsMap[workItemTypeName.toLowerCase()];
}

export function getWorkItemTypeField(
    state: IFieldAwareState,
    workItemTypeName: string,
    fieldNameOrRefName: string
): WorkItemTypeFieldWithReferences | undefined {
    const witFields = getWorkItemTypeFieldsState(state, workItemTypeName);
    if (witFields && witFields.fieldsMap) {
        return witFields.fieldsMap[fieldNameOrRefName.toLowerCase()];
    } else {
        return undefined;
    }
}

export const getWorkItemTypeFields = createSelector(
    getWorkItemTypeFieldsState,
    (state: IWorkItemTypeFields | undefined) => state && state.fields
);

export const getWorkItemTypeFieldsMap = createSelector(
    getWorkItemTypeFieldsState,
    (state: IWorkItemTypeFields | undefined) => state && state.fieldsMap
);

export const getWorkItemTypeFieldsStatus = createSelector(
    getWorkItemTypeFieldsState,
    (state: IWorkItemTypeFields | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getWorkItemTypeFieldsError = createSelector(
    getWorkItemTypeFieldsState,
    (state: IWorkItemTypeFields | undefined) => state && state.error
);
