import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { BugBashEditorPortalActions } from "./Actions";
import { IBugBashEditorPortalAwareState } from "./Contracts";
import { bugBashEditorPortalReducer } from "./Reducers";
import { bugBashEditorPortalSaga } from "./Sagas";

export function getBugBashEditorPortalModule(): ISagaModule<IBugBashEditorPortalAwareState> {
    const reducerMap: ReducersMapObject<IBugBashEditorPortalAwareState, BugBashEditorPortalActions> = {
        bugBashEditorPortalState: bugBashEditorPortalReducer
    };

    return {
        id: "bugBashEditorPortal",
        reducerMap,
        sagas: [bugBashEditorPortalSaga]
    };
}
