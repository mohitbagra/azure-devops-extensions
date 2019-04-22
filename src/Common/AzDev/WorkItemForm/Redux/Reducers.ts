import { produce } from "immer";
import { WorkItemFormActions, WorkItemFormActionTypes } from "./Actions";
import { IWorkItemFormState } from "./Contracts";

const defaultState: IWorkItemFormState = {
    activeWorkItemId: undefined
};

export function workItemFormReducer(state: IWorkItemFormState | undefined, action: WorkItemFormActions): IWorkItemFormState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case WorkItemFormActionTypes.WorkItemLoaded: {
                const { id, isNew, isReadOnly } = action.payload;
                draft.activeWorkItemId = id;
                draft.isNew = isNew;
                draft.isReadOnly = isReadOnly;
                break;
            }

            case WorkItemFormActionTypes.WorkItemUnloaded: {
                draft.activeWorkItemId = undefined;
                draft.isNew = undefined;
                draft.isReadOnly = undefined;
                break;
            }
        }
    });
}
