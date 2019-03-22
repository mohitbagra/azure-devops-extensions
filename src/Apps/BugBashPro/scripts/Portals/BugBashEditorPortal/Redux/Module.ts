import { ReducersMapObject } from "redux";
import { IModule } from "redux-dynamic-modules";
import { BugBashEditorPortalActions } from "./Actions";
import { IBugBashEditorPortalAwareState } from "./Contracts";
import { bugBashEditorPortalReducer } from "./Reducers";

export function getBugBashEditorPortalModule(): IModule<IBugBashEditorPortalAwareState> {
    const reducerMap: ReducersMapObject<IBugBashEditorPortalAwareState, BugBashEditorPortalActions> = {
        bugBashEditorPortalState: bugBashEditorPortalReducer
    };

    return {
        id: "bugBashEditorPortal",
        reducerMap
    };
}
