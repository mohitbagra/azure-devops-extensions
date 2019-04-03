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
                const { bugBashId, bugBashItemId, readFromCache } = action.payload;
                draft.portalOpen = true;
                draft.bugBashId = bugBashId;
                draft.readFromCache = readFromCache;
                draft.bugBashItemId = bugBashItemId;
                break;
            }

            case BugBashItemEditorPortalActionTypes.Initialize:
            case BugBashItemEditorPortalActionTypes.DismissPortal: {
                draft.portalOpen = false;
                draft.readFromCache = true;
                draft.bugBashItemId = undefined;
                draft.bugBashId = undefined;
            }
        }
    });
}
