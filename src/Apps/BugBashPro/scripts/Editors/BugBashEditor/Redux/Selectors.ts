import { IBugBash } from "BugBashPro/Shared/Contracts";
import { IFieldAwareState } from "Common/AzDev/Fields/Redux/Contracts";
import { ITeamAwareState } from "Common/AzDev/Teams/Redux/Contracts";
import { IWorkItemTemplateAwareState } from "Common/AzDev/WorkItemTemplates/Redux/Contracts";
import { IWorkItemTypeAwareState } from "Common/AzDev/WorkItemTypes/Redux/Contracts";
import { createSelector } from "reselect";
import { isBugBashDirty, isBugBashValid } from "../Helpers";
import { IBugBashEditorAwareState, IBugBashEditorState } from "./Contracts";

export function getBugBashEditorState(state: IBugBashEditorAwareState): IBugBashEditorState | undefined {
    return state.bugBashEditorState;
}

export const getDraftBugBash = (state: IBugBashEditorAwareState): IBugBash | undefined => {
    const bugBashEditorState = getBugBashEditorState(state);
    return bugBashEditorState && bugBashEditorState.draftBugBash && bugBashEditorState.draftBugBash.draftValue;
};

export const getOriginalBugBash = (state: IBugBashEditorAwareState): IBugBash | undefined => {
    const bugBashEditorState = getBugBashEditorState(state);
    return bugBashEditorState && bugBashEditorState.draftBugBash && bugBashEditorState.draftBugBash.originalValue;
};

export const isDraftSaving = (state: IBugBashEditorAwareState): boolean => {
    const bugBashEditorState = getBugBashEditorState(state);
    return !!(bugBashEditorState && bugBashEditorState.draftBugBash && bugBashEditorState.draftBugBash.isSaving);
};

export const getDraftInitializeError = (state: IBugBashEditorAwareState): string | undefined => {
    const bugBashEditorState = getBugBashEditorState(state);
    return bugBashEditorState && bugBashEditorState.draftBugBash && bugBashEditorState.draftBugBash.initializeError;
};

export const isDraftDirty = createSelector(
    getDraftBugBash,
    getOriginalBugBash,
    (draft, original) => !!(draft && original && isBugBashDirty(original, draft))
);

export function isDraftValid(
    state: IBugBashEditorAwareState & ITeamAwareState & IFieldAwareState & IWorkItemTypeAwareState & IWorkItemTemplateAwareState
): boolean {
    const draft = getDraftBugBash(state);
    if (!draft) {
        return false;
    }
    return isBugBashValid(state, draft);
}
