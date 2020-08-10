import { reduceReducers } from "Common/Redux";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { BugBashesActions } from "./Actions";
import { defaultBugBashesState, IBugBashesAwareState } from "./Contracts";
import { bugBashLoadReducer } from "./Reducers/BugBashLoadReducer";
import { bugBashUpdateReducer } from "./Reducers/BugBashUpdateReducer";
import { bugBashesSaga } from "./Sagas";

export function getBugBashesModule(): ISagaModule<IBugBashesAwareState> {
    const reducerMap: ReducersMapObject<IBugBashesAwareState, BugBashesActions> = {
        bugBashesState: reduceReducers(defaultBugBashesState, bugBashLoadReducer, bugBashUpdateReducer)
    };

    return {
        id: "bugBashes",
        reducerMap,
        initialActions: [BugBashesActions.initialize()],
        sagas: [bugBashesSaga]
    };
}
