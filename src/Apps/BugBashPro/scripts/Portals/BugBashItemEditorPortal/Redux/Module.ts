import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { BugBashItemEditorPortalActions } from "./Actions";
import { IBugBashItemEditorPortalAwareState } from "./Contracts";
import { bugBashItemEditorPortalReducer } from "./Reducers";
import { bugBashItemEditorPortalSaga } from "./Sagas";

export function getBugBashItemEditorPortalModule(): ISagaModule<IBugBashItemEditorPortalAwareState> {
    const reducerMap: ReducersMapObject<IBugBashItemEditorPortalAwareState, BugBashItemEditorPortalActions> = {
        bugBashItemEditorPortalState: bugBashItemEditorPortalReducer
    };

    return {
        id: "bugBashItemEditorPortal",
        reducerMap,
        sagas: [bugBashItemEditorPortalSaga]
    };
}
