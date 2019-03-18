import { IBugBashItemComment } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { CommentActions, CommentActionTypes } from "./Actions";
import { createCommentAsync, fetchCommentsAsync } from "./DataSource";
import { getCommentsStatus } from "./Selectors";

export function* commentsSaga(): SagaIterator {
    yield takeEvery(CommentActionTypes.CommentsLoadRequested, loadComments);
    yield takeEvery(CommentActionTypes.CommentCreateRequested, createComment);
}

function* loadComments(action: ActionsOfType<CommentActions, CommentActionTypes.CommentsLoadRequested>): SagaIterator {
    const bugBashItemId = action.payload;
    const status: LoadStatus = yield select(getCommentsStatus, bugBashItemId);

    if (status !== LoadStatus.Loading) {
        yield put(CommentActions.beginLoadComments(bugBashItemId));
        const comments: IBugBashItemComment[] = yield call(fetchCommentsAsync, bugBashItemId);
        yield put(CommentActions.commentsLoaded(bugBashItemId, comments));
    }
}

function* createComment(action: ActionsOfType<CommentActions, CommentActionTypes.CommentCreateRequested>): SagaIterator {
    const { bugBashItemId, commentText } = action.payload;
    yield put(CommentActions.beginCreateComment(bugBashItemId, commentText));
    try {
        const createdComment: IBugBashItemComment = yield call(createCommentAsync, bugBashItemId, commentText);
        yield put(CommentActions.commentCreated(bugBashItemId, createdComment));
    } catch (e) {
        yield put(CommentActions.commentCreateFailed(bugBashItemId, commentText, e.message));
    }
}
