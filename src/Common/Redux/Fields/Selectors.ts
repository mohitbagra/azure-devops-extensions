import {
    WorkItemField, WorkItemTypeFieldWithReferences
} from "azure-devops-extension-api/WorkItemTracking";
import { IFieldAwareState, IFieldState } from "Common/Redux/Fields/Contracts";
import { createSelector } from "reselect";

export function getFieldState(state: IFieldAwareState): IFieldState | undefined {
    return state.fieldState;
}

export function getField(state: IFieldAwareState, nameOrRefName: string): WorkItemField | undefined {
    const fieldState = getFieldState(state);
    return fieldState && fieldState.fieldsMap && fieldState.fieldsMap[nameOrRefName.toLowerCase()];
}

export const getFields = createSelector(
    getFieldState,
    (state: IFieldState | undefined) => state && state.fields
);

export const areFieldsLoading = createSelector(
    getFieldState,
    (state: IFieldState | undefined) => !!(state && state.loading)
);

export function areWorkItemTypeFieldsLoading(state: IFieldAwareState, workItemTypeName: string) {
    const fieldState = getFieldState(state);
    const witFields = fieldState && fieldState.workItemTypeFieldsMap && fieldState.workItemTypeFieldsMap[workItemTypeName.toLowerCase()];
    return witFields ? witFields.loading : false;
}

export function getWorkItemTypeField(
    state: IFieldAwareState,
    workItemTypeName: string,
    fieldNameOrRefName: string
): WorkItemTypeFieldWithReferences | undefined {
    const fieldState = getFieldState(state);
    const witFields = fieldState && fieldState.workItemTypeFieldsMap && fieldState.workItemTypeFieldsMap[workItemTypeName.toLowerCase()];
    if (witFields && witFields.fieldsMap) {
        return witFields.fieldsMap[fieldNameOrRefName.toLowerCase()];
    } else {
        return undefined;
    }
}

export function getWorkItemTypeFields(state: IFieldAwareState, workItemTypeName: string): WorkItemTypeFieldWithReferences[] | undefined {
    const fieldState = getFieldState(state);
    const witFields = fieldState && fieldState.workItemTypeFieldsMap && fieldState.workItemTypeFieldsMap[workItemTypeName.toLowerCase()];
    if (witFields) {
        return witFields.fields;
    } else {
        return undefined;
    }
}
