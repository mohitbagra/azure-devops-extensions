import { ReducersMapObject } from "redux";
import { IModule } from "redux-dynamic-modules";
import { BugBashItemEditorPortalActions } from "./Actions";
import { IBugBashItemEditorPortalAwareState } from "./Contracts";
import { bugBashItemEditorPortalReducer } from "./Reducers";

export function getBugBashItemEditorPortalModule(): IModule<IBugBashItemEditorPortalAwareState> {
    const reducerMap: ReducersMapObject<IBugBashItemEditorPortalAwareState, BugBashItemEditorPortalActions> = {
        bugBashItemEditorPortalState: bugBashItemEditorPortalReducer
    };

    return {
        id: "bugBashItemEditorPortal",
        reducerMap
    };
}
