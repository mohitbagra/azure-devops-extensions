import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
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
                const { bugBash, bugBashItem } = action.payload;
                if (!bugBashItem || !isBugBashItemAccepted(bugBashItem)) {
                    // dont open the panel is item is accepted
                    draft.portalOpen = true;
                    draft.bugBash = bugBash;
                    draft.bugBashItemId = bugBashItem ? bugBashItem.id : undefined;
                }
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
