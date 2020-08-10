import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { WorkItemTypeStateActions } from "./Actions";
import { IWorkItemTypeStateAwareState } from "./Contracts";
import { workItemTypeStateReducer } from "./Reducers";
import { workItemTypeStatesSaga } from "./Sagas";

export function getWorkItemTypeStateModule(): ISagaModule<IWorkItemTypeStateAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemTypeStateAwareState, WorkItemTypeStateActions> = {
        workItemTypeStateState: workItemTypeStateReducer
    };

    return {
        id: "workItemTypeStates",
        reducerMap,
        sagas: [workItemTypeStatesSaga]
    };
}
