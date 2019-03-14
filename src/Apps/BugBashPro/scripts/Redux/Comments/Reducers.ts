import { LoadStatus } from "BugBashPro/Shared/Contracts";
import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { produce } from "immer";
import { CommentActions, CommentActionTypes } from "./Actions";
import { defaultState, ICommentsState } from "./Contracts";

export function commentsReducer(state: ICommentsState | undefined, action: CommentActions): ICommentsState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case CommentActionTypes.BeginLoadComments: {
                const bugBashItemId = action.payload;
                draft.commentsMap[resolveNullableMapKey(bugBashItemId)] = {
                    status: LoadStatus.Loading
                };
                break;
            }

            case CommentActionTypes.CommentsLoaded: {
                const { bugBashItemId, comments } = action.payload;
                draft.commentsMap[resolveNullableMapKey(bugBashItemId)] = {
                    status: LoadStatus.Ready,
                    comments: comments
                };
                break;
            }

            case CommentActionTypes.BeginCreateComment: {
                const { bugBashItemId } = action.payload;

                if (draft.commentsMap[resolveNullableMapKey(bugBashItemId)]) {
                    draft.commentsMap[resolveNullableMapKey(bugBashItemId)].status = LoadStatus.Updating;
                }

                break;
            }

            case CommentActionTypes.CommentCreated: {
                const { bugBashItemId, comment } = action.payload;

                if (!draft.commentsMap[resolveNullableMapKey(bugBashItemId)]) {
                    draft.commentsMap[resolveNullableMapKey(bugBashItemId)] = {
                        status: LoadStatus.Ready,
                        comments: []
                    };
                }
                draft.commentsMap[resolveNullableMapKey(bugBashItemId)].comments!.push(comment);
                draft.commentsMap[resolveNullableMapKey(bugBashItemId)].error = undefined;
                draft.commentsMap[resolveNullableMapKey(bugBashItemId)].status = LoadStatus.Ready;
            }
        }
    });
}
