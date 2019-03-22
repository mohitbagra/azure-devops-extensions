import { produce } from "immer";
import { BugBashItemEditorPortalActions, BugBashItemEditorPortalActionTypes } from "./Actions";
import { defaultBugBashItemEditorPortalState, IBugBashItemEditorPortalState } from "./Contracts";

export function bugBashItemEditorPortalReducer(
    state: IBugBashItemEditorPortalState | undefined,
    action: BugBashItemEditorPortalActions
): IBugBashItemEditorPortalState {
    return produce(state || defaultBugBashItemEditorPortalState, draft => {
        switch (action.type) {
            case BugBashItemEditorPortalActionTypes.OpenPortal: {
                const { bugBash, bugBashItemId } = action.payload;
                draft.portalOpen = true;
                draft.bugBash = bugBash;
                draft.bugBashItemId = bugBashItemId;
                break;
            }

            case BugBashItemEditorPortalActionTypes.DismissPortal: {
                draft.portalOpen = false;
                draft.bugBashItemId = undefined;
                draft.bugBash = undefined;
            }
        }
    });
}
