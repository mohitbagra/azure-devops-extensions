import { ReducersMapObject } from "redux";
import { IModule } from "redux-dynamic-modules";
import { WorkItemFormActions } from "./Actions";
import { IWorkItemFormAwareState } from "./Contracts";
import { workItemFormReducer } from "./Reducers";

export function getWorkItemFormModule(): IModule<IWorkItemFormAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemFormAwareState, WorkItemFormActions> = {
        workItemFormState: workItemFormReducer
    };

    return {
        id: "workItemForm",
        reducerMap
    };
}
