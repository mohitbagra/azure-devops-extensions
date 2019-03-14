import { WorkItemActions } from "Common/Redux/WorkItems/Actions";
import { IWorkItemAwareState } from "Common/Redux/WorkItems/Contracts";
import { workItemReducer } from "Common/Redux/WorkItems/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { workItemsSaga } from "./Sagas";

export function getWorkItemModule(): ISagaModule<IWorkItemAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemAwareState, WorkItemActions> = {
        workItemState: workItemReducer
    };

    return {
        id: "workItems",
        reducerMap,
        sagas: [workItemsSaga]
    };
}
