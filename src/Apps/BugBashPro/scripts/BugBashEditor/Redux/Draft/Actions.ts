import { IBugBash } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const BugBashEditorActions = {
    requestDraftInitialize: (bugBashId: string | undefined, useCached?: boolean) =>
        createAction(BugBashEditorActionTypes.RequestDraftInitialize, { bugBashId, useCached }),
    draftInitializeFailed: (bugBashId: string, error: string) => createAction(BugBashEditorActionTypes.DraftInitializeFailed, { bugBashId, error }),
    initializeDraft: (draftBugBash: IBugBash) => createAction(BugBashEditorActionTypes.InitializeDraft, draftBugBash),
    updateDraft: (draftBugBash: IBugBash) => createAction(BugBashEditorActionTypes.UpdateDraft, draftBugBash)
};

export const enum BugBashEditorActionTypes {
    RequestDraftInitialize = "BugBashEditor/RequestDraftInitialize",
    DraftInitializeFailed = "BugBashEditor/DraftInitializeFailed",
    InitializeDraft = "BugBashEditor/InitializeDraft",
    UpdateDraft = "BugBashEditor/UpdateDraft"
}

export type BugBashEditorActions = ActionsUnion<typeof BugBashEditorActions>;
