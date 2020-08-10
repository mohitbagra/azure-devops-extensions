import { WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";

import { FieldActions, FieldActionTypes, WorkItemTypeFieldActions, WorkItemTypeFieldActionTypes } from "./Actions";
import { defaultFieldState, defaultWorkItemTypeFieldState, IFieldState, IWorkItemTypeFieldState } from "./Contracts";

export function fieldReducer(state: IFieldState | undefined, action: FieldActions): IFieldState {
    return produce(state || defaultFieldState, (draft) => {
        switch (action.type) {
            case FieldActionTypes.BeginLoad: {
                draft.status = LoadStatus.Loading;
                draft.fields = undefined;
                draft.fieldsMap = undefined;
                draft.error = undefined;
                break;
            }

            case FieldActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.fields = undefined;
                draft.fieldsMap = undefined;
                draft.status = LoadStatus.LoadFailed;
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
                draft.status = LoadStatus.Ready;
                draft.error = undefined;
            }
        }
    });
}

export function workItemTypeFieldReducer(state: IWorkItemTypeFieldState | undefined, action: WorkItemTypeFieldActions): IWorkItemTypeFieldState {
    return produce(state || defaultWorkItemTypeFieldState, (draft) => {
        switch (action.type) {
            case WorkItemTypeFieldActionTypes.BeginLoad: {
                const workItemTypeName = action.payload;
                draft.workItemTypeFieldsMap[workItemTypeName.toLowerCase()] = {
                    workItemTypeName: workItemTypeName,
                    status: LoadStatus.Loading
                };
                break;
            }

            case WorkItemTypeFieldActionTypes.LoadFailed: {
                const { workItemTypeName, error } = action.payload;
                draft.workItemTypeFieldsMap[workItemTypeName.toLowerCase()] = {
                    workItemTypeName: workItemTypeName,
                    error: error,
                    status: LoadStatus.LoadFailed
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
                    status: LoadStatus.Ready,
                    fields: fields,
                    fieldsMap: fieldsMap
                };
            }
        }
    });
}
