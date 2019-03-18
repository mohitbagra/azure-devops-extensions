import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { ITeamAwareState } from "Common/AzDev/Teams/Redux";
import { isNullOrEmpty } from "Common/Utilities/String";
import { createSelector } from "reselect";
import { isBugBashItemDirty, isBugBashItemValid } from "../../Helpers";
import { IBugBashItemEditorAwareState, IBugBashItemEditorState } from "./Contracts";

export const getBugBashItemEditorState = (state: IBugBashItemEditorAwareState): IBugBashItemEditorState | undefined => {
    return state.bugBashItemEditorState;
};

export const getDraftBugBashItem = (state: IBugBashItemEditorAwareState, bugBashItemId: string | undefined): IBugBashItem | undefined => {
    const bugBashItemEditorState = getBugBashItemEditorState(state);
    const id = resolveNullableMapKey(bugBashItemId);
    return (
        bugBashItemEditorState &&
        bugBashItemEditorState.draftBugBashItemsMap &&
        bugBashItemEditorState.draftBugBashItemsMap[id] &&
        bugBashItemEditorState.draftBugBashItemsMap[id].draftValue
    );
};

export const getOriginalBugBashItem = (state: IBugBashItemEditorAwareState, bugBashItemId: string | undefined): IBugBashItem | undefined => {
    const bugBashItemEditorState = getBugBashItemEditorState(state);
    const id = resolveNullableMapKey(bugBashItemId);
    return (
        bugBashItemEditorState &&
        bugBashItemEditorState.draftBugBashItemsMap &&
        bugBashItemEditorState.draftBugBashItemsMap[id] &&
        bugBashItemEditorState.draftBugBashItemsMap[id].originalValue
    );
};

export const isDraftSaving = (state: IBugBashItemEditorAwareState, bugBashItemId: string | undefined): boolean => {
    const bugBashItemEditorState = getBugBashItemEditorState(state);
    const id = resolveNullableMapKey(bugBashItemId);
    return !!(
        bugBashItemEditorState &&
        bugBashItemEditorState.draftBugBashItemsMap &&
        bugBashItemEditorState.draftBugBashItemsMap[id] &&
        bugBashItemEditorState.draftBugBashItemsMap[id].isSaving
    );
};

export const getDraftInitializeError = (state: IBugBashItemEditorAwareState, bugBashItemId: string | undefined): string | undefined => {
    const bugBashItemEditorState = getBugBashItemEditorState(state);
    const id = resolveNullableMapKey(bugBashItemId);
    return (
        bugBashItemEditorState &&
        bugBashItemEditorState.draftBugBashItemsMap &&
        bugBashItemEditorState.draftBugBashItemsMap[id] &&
        bugBashItemEditorState.draftBugBashItemsMap[id].initializeError
    );
};

export const getDraftComment = (state: IBugBashItemEditorAwareState, bugBashItemId: string | undefined): string | undefined => {
    const bugBashItemEditorState = getBugBashItemEditorState(state);
    const id = resolveNullableMapKey(bugBashItemId);
    return (
        bugBashItemEditorState &&
        bugBashItemEditorState.draftBugBashItemsMap &&
        bugBashItemEditorState.draftBugBashItemsMap[id] &&
        bugBashItemEditorState.draftBugBashItemsMap[id].newComment
    );
};

export function isDraftValid(state: IBugBashItemEditorAwareState & ITeamAwareState, bugBashItemId: string | undefined): boolean {
    const draft = getDraftBugBashItem(state, bugBashItemId);
    if (!draft) {
        return false;
    }
    return isBugBashItemValid(state, draft);
}

export const isDraftDirty = createSelector(
    getDraftBugBashItem,
    getOriginalBugBashItem,
    getDraftComment,
    (draft, original, draftComment) => !!(draft && original && (!isNullOrEmpty(draftComment) || isBugBashItemDirty(original, draft)))
);
