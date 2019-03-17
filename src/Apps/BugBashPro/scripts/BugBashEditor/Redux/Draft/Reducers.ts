import { BugBashesActions, BugBashesActionTypes } from "BugBashPro/Redux/BugBashes";
import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { produce } from "immer";
import { BugBashEditorActions, BugBashEditorActionTypes } from "./Actions";
import { defaultBugBashEditorState, IBugBashEditorState } from "./Contracts";

export function bugBashEditorReducer(state: IBugBashEditorState | undefined, action: BugBashEditorActions | BugBashesActions): IBugBashEditorState {
    return produce(state || defaultBugBashEditorState, draft => {
        switch (action.type) {
            case BugBashEditorActionTypes.InitializeDraft: {
                const bugBash = action.payload;
                const id = resolveNullableMapKey(bugBash.id);
                draft.draftBugBashMap[id] = {
                    originalValue: { ...bugBash },
                    draftValue: { ...bugBash }
                };
                break;
            }

            case BugBashEditorActionTypes.UpdateDraft: {
                const bugBash = action.payload;
                const id = resolveNullableMapKey(bugBash.id);
                if (draft.draftBugBashMap[id]) {
                    draft.draftBugBashMap[id].draftValue = { ...bugBash };
                }
                break;
            }

            case BugBashEditorActionTypes.DraftInitializeFailed: {
                const { bugBashId, error } = action.payload;
                const id = resolveNullableMapKey(bugBashId);
                draft.draftBugBashMap[id] = {
                    initializeError: error,
                    originalValue: undefined,
                    draftValue: undefined
                };
                break;
            }

            case BugBashEditorActionTypes.DraftSaveSucceeded: {
                const updatedBugBash = action.payload;
                const id = resolveNullableMapKey(updatedBugBash.id);
                if (draft.draftBugBashMap[id]) {
                    draft.draftBugBashMap[id] = {
                        originalValue: { ...updatedBugBash },
                        draftValue: { ...updatedBugBash },
                        isSaving: false
                    };
                }

                break;
            }

            case BugBashesActionTypes.BeginCreateBugBash:
            case BugBashesActionTypes.BeginUpdateBugBash: {
                const bugBash = action.payload;
                const id = resolveNullableMapKey(bugBash.id);
                if (draft.draftBugBashMap[id]) {
                    draft.draftBugBashMap[id].isSaving = true;
                }
            }
        }
    });
}
