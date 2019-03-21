import { createSelector } from "reselect";
import { IBugBashSettingsPortalAwareState, IBugBashSettingsPortalState } from "./Contracts";

export function getSettingsPortalState(state: IBugBashSettingsPortalAwareState): IBugBashSettingsPortalState | undefined {
    return state.settingsPortalState;
}

export const isSettingsPortalOpen = createSelector(
    getSettingsPortalState,
    state => !!(state && state.portalOpen)
);
