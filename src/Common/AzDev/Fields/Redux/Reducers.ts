import { WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking";
import { produce } from "immer";
import { FieldActions, FieldActionTypes, WorkItemTypeFieldActions, WorkItemTypeFieldActionTypes } from "./Actions";
import { defaultState, IFieldState } from "./Contracts";

export function fieldReducer(state: IFieldState | undefined, action: FieldActions | WorkItemTypeFieldActions): IFieldState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case FieldActionTypes.BeginLoad: {
                draft.loading = true;
                draft.fields = undefined;
                draft.fieldsMap = undefined;
                draft.error = undefined;
                break;
            }

            case FieldActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.fields = undefined;
                draft.fieldsMap = undefined;
                draft.loading = false;
                break;
            }

            case FieldActionTypes.LoadSucceeded: {
                const fields = action.payload;
                draft.fields = fields;
                draft.fieldsMap = {};
                for (const field of fields) {
                    draft.fieldsMap[field.name.toLowerCase()] = field;
                    draft.fieldsMap[field.referenceName.toLowerCase()] = field;
                }
                draft.loading = false;
                draft.error = undefined;
                break;
            }

            case WorkItemTypeFieldActionTypes.BeginLoad: {
                const workItemTypeName = action.payload;
                draft.workItemTypeFieldsMap[workItemTypeName.toLowerCase()] = {
                    workItemTypeName: workItemTypeName,
                    loading: true
                };
                break;
            }

            case WorkItemTypeFieldActionTypes.LoadFailed: {
                const { workItemTypeName, error } = action.payload;
                draft.workItemTypeFieldsMap[workItemTypeName.toLowerCase()] = {
                    workItemTypeName: workItemTypeName,
                    error: error,
                    loading: false
                };
                break;
            }

            case WorkItemTypeFieldActionTypes.LoadSucceeded: {
                const { workItemTypeName, fields } = action.payload;
                const fieldsMap: { [nameOrRefName: string]: WorkItemTypeFieldWithReferences } = {};
                for (const field of fields) {
                    fieldsMap[field.name.toLowerCase()] = field;
                    fieldsMap[field.referenceName.toLowerCase()] = field;
                }
                draft.workItemTypeFieldsMap[workItemTypeName.toLowerCase()] = {
                    workItemTypeName: workItemTypeName,
                    loading: false,
                    fields: fields,
                    fieldsMap: fieldsMap
                };
            }
        }
    });
}
