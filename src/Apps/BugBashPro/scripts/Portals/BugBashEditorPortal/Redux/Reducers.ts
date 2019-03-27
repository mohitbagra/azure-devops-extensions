import { produce } from "immer";
import { BugBashEditorPortalActions, BugBashEditorPortalActionTypes } from "./Actions";
import { defaultBugBashEditorPortalState, IBugBashEditorPortalState } from "./Contracts";

export function bugBashEditorPortalReducer(
    state: IBugBashEditorPortalState | undefined,
    action: BugBashEditorPortalActions
): IBugBashEditorPortalState {
    return produce(state || defaultBugBashEditorPortalState, draft => {
        switch (action.type) {
            case BugBashEditorPortalActionTypes.OpenPortal: {
                const { bugBashId, readFromCache } = action.payload;
                draft.portalOpen = true;
                draft.bugBashId = bugBashId;
                draft.readFromCache = readFromCache;
                break;
            }

            case BugBashEditorPortalActionTypes.DismissPortal: {
                draft.portalOpen = false;
                draft.readFromCache = true;
                draft.bugBashId = undefined;
            }
        }
    });
}
