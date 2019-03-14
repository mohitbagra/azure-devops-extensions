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
                draft.portalOpen = true;
                draft.bugBashId = action.payload;
                break;
            }

            case BugBashEditorPortalActionTypes.DismissPortal: {
                draft.portalOpen = false;
                draft.bugBashId = undefined;
            }
        }
    });
}
