import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { FieldActions, WorkItemTypeFieldActions } from "./Actions";
import { IFieldAwareState } from "./Contracts";
import { fieldReducer, workItemTypeFieldReducer } from "./Reducers";
import { fieldsSaga } from "./Sagas";

export function getFieldModule(): ISagaModule<IFieldAwareState> {
    const reducerMap: ReducersMapObject<IFieldAwareState, FieldActions | WorkItemTypeFieldActions> = {
        fieldState: fieldReducer,
        workItemTypeFieldState: workItemTypeFieldReducer
    };

    return {
        id: "fields",
        reducerMap,
        sagas: [fieldsSaga]
    };
}
