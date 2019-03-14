import { BugBashItemsActions, BugBashItemsActionTypes } from "BugBashPro/Redux/BugBashItems";
import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { produce } from "immer";
import { BugBashItemEditorActions, BugBashItemEditorActionTypes } from "./Actions";
import { defaultBugBashItemEditorState, IBugBashItemEditorState } from "./Contracts";

export function bugBashItemEditorReducer(
    state: IBugBashItemEditorState | undefined,
    action: BugBashItemEditorActions | BugBashItemsActions
): IBugBashItemEditorState {
    return produce(state || defaultBugBashItemEditorState, draft => {
        switch (action.type) {
            case BugBashItemEditorActionTypes.InitializeDraft: {
                const bugBashItem = action.payload;
                const id = resolveNullableMapKey(bugBashItem.id);
                if (!draft.draftBugBashItemsMap[id]) {
                    draft.draftBugBashItemsMap[id] = {
                        originalValue: { ...bugBashItem },
                        draftValue: { ...bugBashItem }
                    };
                }
                break;
            }

            case BugBashItemEditorActionTypes.UpdateDraft: {
                const bugBashItem = action.payload;
                const id = resolveNullableMapKey(bugBashItem.id);
                if (draft.draftBugBashItemsMap[id]) {
                    draft.draftBugBashItemsMap[id].draftValue = { ...bugBashItem };
                }
                break;
            }

            case BugBashItemEditorActionTypes.UpdateDraftComment: {
                const { bugBashItemId, comment } = action.payload;
                const id = resolveNullableMapKey(bugBashItemId);
                if (draft.draftBugBashItemsMap[id]) {
                    draft.draftBugBashItemsMap[id].newComment = comment;
                }
                break;
            }

            case BugBashItemEditorActionTypes.DraftInitializeFailed: {
                const { bugBashItemId, error } = action.payload;
                const id = resolveNullableMapKey(bugBashItemId);
                draft.draftBugBashItemsMap[id] = {
                    initializeError: error,
                    originalValue: undefined,
                    draftValue: undefined
                };
                break;
            }

            case BugBashItemEditorActionTypes.DraftSaveSucceeded: {
                const updatedBugBashItem = action.payload;
                const id = resolveNullableMapKey(updatedBugBashItem.id);
                if (draft.draftBugBashItemsMap[id]) {
                    draft.draftBugBashItemsMap[id] = {
                        originalValue: { ...updatedBugBashItem },
                        draftValue: { ...updatedBugBashItem },
                        newComment: undefined,
                        isSaving: false
                    };
                }

                break;
            }

            case BugBashItemsActionTypes.BeginCreateBugBashItem:
            case BugBashItemsActionTypes.BeginUpdateBugBashItem: {
                const bugBashItem = action.payload;
                const id = resolveNullableMapKey(bugBashItem.id);
                if (draft.draftBugBashItemsMap[id]) {
                    draft.draftBugBashItemsMap[id].isSaving = true;
                }
            }
        }
    });
}
