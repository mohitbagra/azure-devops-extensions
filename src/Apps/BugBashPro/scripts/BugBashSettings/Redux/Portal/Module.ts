import { ReducersMapObject } from "redux";
import { IModule } from "redux-dynamic-modules";
import { BugBashSettingsPortalActions } from "./Actions";
import { IBugBashSettingsPortalAwareState } from "./Contracts";
import { settingsPortalReducer } from "./Reducers";

export function getBugBashSettingsPortalModule(): IModule<IBugBashSettingsPortalAwareState> {
    const reducerMap: ReducersMapObject<IBugBashSettingsPortalAwareState, BugBashSettingsPortalActions> = {
        settingsPortalState: settingsPortalReducer
    };

    return {
        id: "bugBashSettingsPortal",
        reducerMap
    };
}
