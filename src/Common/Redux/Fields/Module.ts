import { FieldActions, WorkItemTypeFieldActions } from "Common/Redux/Fields/Actions";
import { IFieldAwareState } from "Common/Redux/Fields/Contracts";
import { fieldReducer } from "Common/Redux/Fields/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { fieldsSaga } from "./Sagas";

export function getFieldModule(): ISagaModule<IFieldAwareState> {
    const reducerMap: ReducersMapObject<IFieldAwareState, FieldActions | WorkItemTypeFieldActions> = {
        fieldState: fieldReducer
    };

    return {
        id: "fields",
        reducerMap,
        sagas: [fieldsSaga]
    };
}
