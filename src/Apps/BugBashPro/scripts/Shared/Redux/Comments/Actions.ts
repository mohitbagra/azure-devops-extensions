import { IBugBashItemComment } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const CommentActions = {
    commentsLoadRequested: (bugBashItemId: string) => createAction(CommentActionTypes.CommentsLoadRequested, bugBashItemId),
    beginLoadComments: (bugBashItemId: string) => createAction(CommentActionTypes.BeginLoadComments, bugBashItemId),
    commentsLoaded: (bugBashItemId: string, comments: IBugBashItemComment[]) =>
        createAction(CommentActionTypes.CommentsLoaded, { bugBashItemId, comments }),

    commentCreateRequested: (bugBashItemId: string, commentText: string) =>
        createAction(CommentActionTypes.CommentCreateRequested, { bugBashItemId, commentText }),
    beginCreateComment: (bugBashItemId: string, commentText: string) =>
        createAction(CommentActionTypes.BeginCreateComment, { bugBashItemId, commentText }),
    commentCreated: (bugBashItemId: string, comment: IBugBashItemComment) =>
        createAction(CommentActionTypes.CommentCreated, { bugBashItemId, comment }),
    commentCreateFailed: (bugBashItemId: string, commentText: string, error: string) =>
        createAction(CommentActionTypes.CommentCreateFailed, { bugBashItemId, commentText, error })
};

export const enum CommentActionTypes {
    CommentsLoadRequested = "CommentActions/CommentsLoadRequested",
    BeginLoadComments = "CommentActions/BeginLoadComments",
    CommentsLoaded = "CommentActions/CommentsLoaded",

    CommentCreateRequested = "CommentActions/CommentCreateRequested",
    BeginCreateComment = "CommentActions/BeginCreateComment",
    CommentCreated = "CommentActions/CommentCreated",
    CommentCreateFailed = "CommentActions/CommentCreateFailed"
}

export type CommentActions = ActionsUnion<typeof CommentActions>;
