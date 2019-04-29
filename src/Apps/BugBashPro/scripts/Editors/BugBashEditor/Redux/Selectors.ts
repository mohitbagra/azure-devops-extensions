import { IBugBash } from "BugBashPro/Shared/Contracts";
import { IFieldAwareState } from "Common/AzDev/Fields/Redux/Contracts";
import { ITeamAwareState } from "Common/AzDev/Teams/Redux/Contracts";
import { IWorkItemTemplateAwareState } from "Common/AzDev/WorkItemTemplates/Redux/Contracts";
import { IWorkItemTypeAwareState } from "Common/AzDev/WorkItemTypes/Redux/Contracts";
import { resolveNullableMapKey } from "Common/Utilities/String";
import { createSelector } from "reselect";
import { isBugBashDirty, isBugBashValid } from "../Helpers";
import { IBugBashEditorAwareState, IBugBashEditorState } from "./Contracts";

export function getBugBashEditorState(state: IBugBashEditorAwareState): IBugBashEditorState | undefined {
    return state.bugBashEditorState;
}

export const getDraftBugBash = (state: IBugBashEditorAwareState, bugBashId: string | undefined): IBugBash | undefined => {
    const bugBashEditorState = getBugBashEditorState(state);
    const id = resolveNullableMapKey(bugBashId);
    return (
        bugBashEditorState &&
        bugBashEditorState.draftBugBashMap &&
        bugBashEditorState.draftBugBashMap[id] &&
        bugBashEditorState.draftBugBashMap[id].draftValue
    );
};

export const getOriginalBugBash = (state: IBugBashEditorAwareState, bugBashId: string | undefined): IBugBash | undefined => {
    const bugBashEditorState = getBugBashEditorState(state);
    const id = resolveNullableMapKey(bugBashId);
    return (
        bugBashEditorState &&
        bugBashEditorState.draftBugBashMap &&
        bugBashEditorState.draftBugBashMap[id] &&
        bugBashEditorState.draftBugBashMap[id].originalValue
    );
};

export const isDraftSaving = (state: IBugBashEditorAwareState, bugBashId: string | undefined): boolean => {
    const bugBashEditorState = getBugBashEditorState(state);
    const id = resolveNullableMapKey(bugBashId);
    return !!(
        bugBashEditorState &&
        bugBashEditorState.draftBugBashMap &&
        bugBashEditorState.draftBugBashMap[id] &&
        bugBashEditorState.draftBugBashMap[id].isSaving
    );
};

export const getDraftInitializeError = (state: IBugBashEditorAwareState, bugBashId: string | undefined): string | undefined => {
    const bugBashEditorState = getBugBashEditorState(state);
    const id = resolveNullableMapKey(bugBashId);
    return (
        bugBashEditorState &&
        bugBashEditorState.draftBugBashMap &&
        bugBashEditorState.draftBugBashMap[id] &&
        bugBashEditorState.draftBugBashMap[id].initializeError
    );
};

export const isDraftDirty = createSelector(
    getDraftBugBash,
    getOriginalBugBash,
    (draft, original) => !!(draft && original && isBugBashDirty(original, draft))
);

export function isDraftValid(
    state: IBugBashEditorAwareState & ITeamAwareState & IFieldAwareState & IWorkItemTypeAwareState & IWorkItemTemplateAwareState,
    bugBashId: string | undefined
): boolean {
    const draft = getDraftBugBash(state, bugBashId);
    if (!draft) {
        return false;
    }
    return isBugBashValid(state, draft);
}
