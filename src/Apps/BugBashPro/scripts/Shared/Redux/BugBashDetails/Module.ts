import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { BugBashDetailActions } from "./Actions";
import { IBugBashDetailsAwareState } from "./Contracts";
import { bugBashDetailsReducer } from "./Reducers";
import { bugBashDetailsSaga } from "./Sagas";

export function getBugBashDetailsModule(): ISagaModule<IBugBashDetailsAwareState> {
    const reducerMap: ReducersMapObject<IBugBashDetailsAwareState, BugBashDetailActions> = {
        bugBashDetailsState: bugBashDetailsReducer
    };

    return {
        id: "bugBashDetails",
        reducerMap,
        sagas: [bugBashDetailsSaga]
    };
}
