import { IBugBash } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashEditorActions = {
    requestDraftInitialize: (bugBashId: string | undefined, readFromCache: boolean) =>
        createAction(BugBashEditorActionTypes.RequestDraftInitialize, { bugBashId, readFromCache }),
    draftInitializeFailed: (bugBashId: string, error: string) => createAction(BugBashEditorActionTypes.DraftInitializeFailed, { bugBashId, error }),
    initializeDraft: (draftBugBash: IBugBash) => createAction(BugBashEditorActionTypes.InitializeDraft, draftBugBash),
    updateDraft: (draftBugBash: IBugBash) => createAction(BugBashEditorActionTypes.UpdateDraft, draftBugBash),
    requestDraftSave: (bugBashId: string | undefined) => createAction(BugBashEditorActionTypes.RequestDraftSave, bugBashId),
    draftSaveSucceeded: (bugBash: IBugBash) => createAction(BugBashEditorActionTypes.DraftSaveSucceeded, bugBash)
};

export const enum BugBashEditorActionTypes {
    RequestDraftInitialize = "BugBashEditor/RequestDraftInitialize",
    DraftInitializeFailed = "BugBashEditor/DraftInitializeFailed",
    InitializeDraft = "BugBashEditor/InitializeDraft",
    UpdateDraft = "BugBashEditor/UpdateDraft",
    RequestDraftSave = "BugBashEditor/RequestDraftSave",
    DraftSaveSucceeded = "BugBashEditor/DraftSaveSucceeded"
}

export type BugBashEditorActions = ActionsUnion<typeof BugBashEditorActions>;
