import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { BugBashEditorActions } from "./Actions";
import { IBugBashEditorAwareState } from "./Contracts";
import { bugBashEditorReducer } from "./Reducers";
import { bugBashEditorSaga } from "./Sagas";

export function getBugBashEditorModule(bugBashId: string | undefined): ISagaModule<IBugBashEditorAwareState> {
    const reducerMap: ReducersMapObject<IBugBashEditorAwareState, BugBashEditorActions> = {
        bugBashEditorState: bugBashEditorReducer
    };

    return {
        id: "bugBashEditor",
        reducerMap,
        sagas: [{
            saga: bugBashEditorSaga,
            argument: bugBashId
        }]
    };
}
