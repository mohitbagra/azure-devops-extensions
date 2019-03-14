import { WorkItemTypeStateActions } from "Common/Redux/WorkItemTypeStates/Actions";
import { IWorkItemTypeStateAwareState } from "Common/Redux/WorkItemTypeStates/Contracts";
import { workItemTypeStateReducer } from "Common/Redux/WorkItemTypeStates/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
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
