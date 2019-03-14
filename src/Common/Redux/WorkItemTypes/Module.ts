import { WorkItemTypeActions } from "Common/Redux/WorkItemTypes/Actions";
import { IWorkItemTypeAwareState } from "Common/Redux/WorkItemTypes/Contracts";
import { workItemTypeReducer } from "Common/Redux/WorkItemTypes/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
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
