import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { BugBashItemEditorActions } from "./Actions";
import { IBugBashItemEditorAwareState } from "./Contracts";
import { bugBashItemEditorReducer } from "./Reducers";
import { bugBashItemEditorSaga } from "./Sagas";

export function getBugBashItemEditorModule(): ISagaModule<IBugBashItemEditorAwareState> {
    const reducerMap: ReducersMapObject<IBugBashItemEditorAwareState, BugBashItemEditorActions> = {
        bugBashItemEditorState: bugBashItemEditorReducer
    };

    return {
        id: "bugBashItemEditor",
        reducerMap,
        sagas: [bugBashItemEditorSaga]
    };
}
