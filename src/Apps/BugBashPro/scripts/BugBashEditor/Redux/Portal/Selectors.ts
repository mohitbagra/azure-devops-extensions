import { createSelector } from "reselect";
import { IBugBashEditorPortalAwareState, IBugBashEditorPortalState } from "./Contracts";

export function getBugBashEditorPortalState(state: IBugBashEditorPortalAwareState): IBugBashEditorPortalState | undefined {
    return state.bugBashEditorPortalState;
}

export const isBugBashEditorPortalOpen = createSelector(
    getBugBashEditorPortalState,
    state => !!(state && state.portalOpen)
);

export const getEditBugBashId = createSelector(
    getBugBashEditorPortalState,
    state => state && state.bugBashId
);
