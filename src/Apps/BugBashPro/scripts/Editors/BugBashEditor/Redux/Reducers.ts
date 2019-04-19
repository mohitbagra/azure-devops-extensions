import { equals } from "azure-devops-ui/Core/Util/String";
import { BugBashesActions, BugBashesActionTypes } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { produce } from "immer";
import { BugBashEditorActions, BugBashEditorActionTypes } from "./Actions";
import { IBugBashEditorState } from "./Contracts";

const defaultState: IBugBashEditorState = {
    draftBugBash: undefined
};

export function bugBashEditorReducer(state: IBugBashEditorState | undefined, action: BugBashEditorActions | BugBashesActions): IBugBashEditorState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case BugBashEditorActionTypes.InitializeDraft: {
                const bugBash = action.payload;
                draft.draftBugBash = {
                    originalValue: { ...bugBash },
                    draftValue: { ...bugBash }
                };
                break;
            }

            case BugBashEditorActionTypes.DraftInitializeFailed: {
                const error = action.payload;
                draft.draftBugBash = {
                    initializeError: error,
                    originalValue: undefined,
                    draftValue: undefined
                };
                break;
            }

            case BugBashEditorActionTypes.UpdateDraft: {
                const bugBash = action.payload;
                if (
                    draft.draftBugBash &&
                    draft.draftBugBash.originalValue &&
                    equals(bugBash.id || "", draft.draftBugBash.originalValue.id || "", true)
                ) {
                    draft.draftBugBash.draftValue = { ...bugBash };
                }

                break;
            }

            case BugBashEditorActionTypes.DraftSaveSucceeded: {
                const updatedBugBash = action.payload;
                if (
                    draft.draftBugBash &&
                    draft.draftBugBash.originalValue &&
                    equals(updatedBugBash.id || "", draft.draftBugBash.originalValue.id || "", true)
                ) {
                    draft.draftBugBash.draftValue = { ...updatedBugBash };
                    draft.draftBugBash.originalValue = { ...updatedBugBash };
                    draft.draftBugBash.isSaving = false;
                }

                break;
            }

            case BugBashesActionTypes.BeginCreateBugBash:
            case BugBashesActionTypes.BeginUpdateBugBash: {
                const bugBash = action.payload;
                if (
                    draft.draftBugBash &&
                    draft.draftBugBash.originalValue &&
                    equals(bugBash.id || "", draft.draftBugBash.originalValue.id || "", true)
                ) {
                    draft.draftBugBash.isSaving = true;
                }
            }
        }
    });
}
