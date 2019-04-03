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

export const getEditBugBashItemBugBashId = createSelector(
    getBugBashItemEditorPortalState,
    state => state && state.bugBashId
);

export const shouldReadFromCache = createSelector(
    getBugBashItemEditorPortalState,
    state => !!(state && state.readFromCache)
);
