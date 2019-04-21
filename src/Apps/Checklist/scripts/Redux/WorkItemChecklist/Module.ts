import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { WorkItemChecklistActions } from "./Actions";
import { IWorkItemChecklistAwareState } from "./Contracts";
import { workItemChecklistReducer } from "./Reducers";
import { workItemChecklistSaga } from "./Sagas";

export function getWorkItemChecklistModule(): ISagaModule<IWorkItemChecklistAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemChecklistAwareState, WorkItemChecklistActions> = {
        workItemChecklistState: workItemChecklistReducer
    };

    return {
        id: "workItemChecklist",
        reducerMap,
        sagas: [workItemChecklistSaga]
    };
}
