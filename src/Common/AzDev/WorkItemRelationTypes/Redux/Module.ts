import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { WorkItemRelationTypeActions } from "./Actions";
import { IWorkItemRelationTypeAwareState } from "./Contracts";
import { workItemRelationTypeReducer } from "./Reducers";
import { workItemRelationTypesSaga } from "./Sagas";

export function getWorkItemRelationTypeModule(): ISagaModule<IWorkItemRelationTypeAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemRelationTypeAwareState, WorkItemRelationTypeActions> = {
        workItemRelationTypeState: workItemRelationTypeReducer
    };

    return {
        id: "workItemRelationTypes",
        reducerMap,
        sagas: [workItemRelationTypesSaga]
    };
}
