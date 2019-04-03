import { ReducersMapObject } from "redux";
import { IModule } from "redux-dynamic-modules";
import { BugBashPortalActions } from "./Actions";
import { IBugBashPortalAwareState } from "./Contracts";
import { portalReducer } from "./Reducers";

export function getBugBashPortalModule(): IModule<IBugBashPortalAwareState> {
    const reducerMap: ReducersMapObject<IBugBashPortalAwareState, BugBashPortalActions> = {
        portalState: portalReducer
    };

    return {
        id: "bugBashPortal",
        reducerMap
    };
}
