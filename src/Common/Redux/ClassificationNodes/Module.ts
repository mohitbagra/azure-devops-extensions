import { AreaPathActions, IterationPathActions } from "Common/Redux/ClassificationNodes/Actions";
import { IClassificationNodeAwareState } from "Common/Redux/ClassificationNodes/Contracts";
import { areaPathReducer, iterationPathReducer } from "Common/Redux/ClassificationNodes/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
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
