import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { BugBashDirectoryActions } from "./Actions";
import { IBugBashDirectoryAwareState } from "./Contracts";
import { bugBashDirectoryReducer } from "./Reducers";
import { bugBashDirectorySaga } from "./Sagas";

export function getBugBashDirectoryModule(): ISagaModule<IBugBashDirectoryAwareState> {
    const reducerMap: ReducersMapObject<IBugBashDirectoryAwareState, BugBashDirectoryActions> = {
        bugBashDirectoryState: bugBashDirectoryReducer
    };

    return {
        id: "bugBashDirectory",
        reducerMap,
        initialActions: [BugBashDirectoryActions.initialize()],
        sagas: [bugBashDirectorySaga]
    };
}
