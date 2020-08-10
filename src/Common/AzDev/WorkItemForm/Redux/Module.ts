import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { WorkItemFormActions } from "./Actions";
import { IWorkItemFormAwareState } from "./Contracts";
import { workItemFormReducer } from "./Reducers";
import { workItemFormSaga } from "./Sagas";

export function getWorkItemFormModule(): ISagaModule<IWorkItemFormAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemFormAwareState, WorkItemFormActions> = {
        workItemFormState: workItemFormReducer
    };

    return {
        id: "workItemForm",
        reducerMap,
        sagas: [workItemFormSaga]
    };
}
