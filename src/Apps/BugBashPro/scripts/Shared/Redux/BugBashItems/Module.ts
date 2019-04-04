import { reduceReducers } from "Common/Redux";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { BugBashItemsActions } from "./Actions";
import { defaultBugBashItemsState, IBugBashItemsAwareState } from "./Contracts";
import { bugBashItemLoadReducer } from "./Reducers/BugBashItemLoadReducer";
import { bugBashItemUpdateReducer } from "./Reducers/BugBashItemUpdateReducer";
import { bugBashItemsSaga } from "./Sagas";

export function getBugBashItemsModule(): ISagaModule<IBugBashItemsAwareState> {
    const reducerMap: ReducersMapObject<IBugBashItemsAwareState, BugBashItemsActions> = {
        bugBashItemsState: reduceReducers(defaultBugBashItemsState, bugBashItemLoadReducer, bugBashItemUpdateReducer)
    };

    return {
        id: "bugBashItems",
        reducerMap,
        initialActions: [BugBashItemsActions.initialize()],
        sagas: [bugBashItemsSaga]
    };
}
