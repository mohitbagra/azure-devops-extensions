import { createSelector } from "reselect";

import { IBugBashPortalAwareState, IBugBashPortalState } from "./Contracts";

export function getPortalState(state: IBugBashPortalAwareState): IBugBashPortalState | undefined {
    return state.portalState;
}

export const isPortalOpen = createSelector(getPortalState, (state) => !!(state && state.portalType !== undefined && state.portalOpen));

export const getPortalType = createSelector(getPortalState, (state) => state && state.portalType);

export const getPortalProps = createSelector(getPortalState, (state) => state && state.portalProps);
