import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { AreaPathActions, IterationPathActions } from "./Actions";
import { IClassificationNodeAwareState } from "./Contracts";
import { areaPathReducer, iterationPathReducer } from "./Reducers";
import { classificationNodesSaga } from "./Sagas";

export function getClassificationNodeModule(): ISagaModule<IClassificationNodeAwareState> {
    const reducerMap: ReducersMapObject<IClassificationNodeAwareState, AreaPathActions & IterationPathActions> = {
        areaPathState: areaPathReducer,
        iterationPathState: iterationPathReducer
    };

    return {
        id: "classificationNodes",
        reducerMap,
        sagas: [classificationNodesSaga]
    };
}
