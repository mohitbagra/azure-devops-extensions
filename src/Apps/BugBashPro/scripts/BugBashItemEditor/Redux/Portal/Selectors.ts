import { createSelector } from "reselect";
import { IBugBashItemEditorPortalAwareState, IBugBashItemEditorPortalState } from "./Contracts";

export function getBugBashItemEditorPortalState(state: IBugBashItemEditorPortalAwareState): IBugBashItemEditorPortalState | undefined {
    return state.bugBashItemEditorPortalState;
}

export const isBugBashItemEditorPortalOpen = createSelector(
    getBugBashItemEditorPortalState,
    state => !!(state && state.portalOpen)
);

export const getEditBugBashItemId = createSelector(
    getBugBashItemEditorPortalState,
    state => state && state.bugBashItemId
);

export const getEditBugBashItemBugBash = createSelector(
    getBugBashItemEditorPortalState,
    state => state && state.bugBash
);
