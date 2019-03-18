import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { WorkItemTypeActions } from "./Actions";
import { IWorkItemTypeAwareState } from "./Contracts";
import { workItemTypeReducer } from "./Reducers";
import { workItemTypesSaga } from "./Sagas";

export function getWorkItemTypeModule(): ISagaModule<IWorkItemTypeAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemTypeAwareState, WorkItemTypeActions> = {
        workItemTypeState: workItemTypeReducer
    };

    return {
        id: "workItemTypes",
        reducerMap,
        sagas: [workItemTypesSaga]
    };
}
