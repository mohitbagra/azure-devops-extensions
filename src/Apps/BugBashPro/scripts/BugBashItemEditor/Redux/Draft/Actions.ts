import { IBugBash, IBugBashItem } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const BugBashItemEditorActions = {
    requestDraftInitialize: (bugBash: IBugBash, bugBashItemId: string | undefined, useCached?: boolean) =>
        createAction(BugBashItemEditorActionTypes.RequestDraftInitialize, { bugBash, bugBashItemId, useCached }),
    draftInitializeFailed: (bugBash: IBugBash, bugBashItemId: string, error: string) =>
        createAction(BugBashItemEditorActionTypes.DraftInitializeFailed, { bugBash, bugBashItemId, error }),
    initializeDraft: (draftBugBashItem: IBugBashItem) => createAction(BugBashItemEditorActionTypes.InitializeDraft, draftBugBashItem),
    updateDraft: (draftBugBashItem: IBugBashItem) => createAction(BugBashItemEditorActionTypes.UpdateDraft, draftBugBashItem),
    updateDraftComment: (bugBashItemId: string | undefined, comment: string) =>
        createAction(BugBashItemEditorActionTypes.UpdateDraftComment, { bugBashItemId, comment }),
    requestDraftSave: (bugBashItemId: string | undefined) => createAction(BugBashItemEditorActionTypes.RequestDraftSave, bugBashItemId),
    draftSaveSucceeded: (bugBashItem: IBugBashItem) => createAction(BugBashItemEditorActionTypes.DraftSaveSucceeded, bugBashItem),
    requestDraftAccept: (bugBash: IBugBash, bugBashItemId: string | undefined) =>
        createAction(BugBashItemEditorActionTypes.RequestDraftAccept, { bugBash, bugBashItemId })
};

export const enum BugBashItemEditorActionTypes {
    RequestDraftInitialize = "BugBashItemEditor/RequestDraftInitialize",
    DraftInitializeFailed = "BugBashItemEditor/DraftInitializeFailed",
    InitializeDraft = "BugBashItemEditor/InitializeDraft",
    UpdateDraft = "BugBashItemEditor/UpdateDraft",
    UpdateDraftComment = "BugBashItemEditor/UpdateDraftComment",
    RequestDraftSave = "BugBashItemEditor/RequestDraftSave",
    DraftSaveSucceeded = "BugBashItemEditor/DraftSaveSucceeded",
    RequestDraftAccept = "BugBashItemEditor/RequestDraftAccept"
}

export type BugBashItemEditorActions = ActionsUnion<typeof BugBashItemEditorActions>;
