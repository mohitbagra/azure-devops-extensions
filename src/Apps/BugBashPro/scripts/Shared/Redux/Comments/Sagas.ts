import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects";

import { CommentActions, CommentActionTypes } from "./Actions";
import { createCommentAsync, fetchCommentsAsync } from "./DataSource";
import { getCommentsStatus } from "./Selectors";

export function* commentsSaga(): SagaIterator {
    yield takeLeading(CommentActionTypes.CommentsLoadRequested, loadComments);
    yield takeEvery(CommentActionTypes.CommentCreateRequested, createComment);
}

function* loadComments(action: ActionsOfType<CommentActions, CommentActionTypes.CommentsLoadRequested>): SagaIterator {
    const bugBashItemId = action.payload;
    const status: RT<typeof getCommentsStatus> = yield select(getCommentsStatus, bugBashItemId);

    if (status !== LoadStatus.Loading) {
        yield put(CommentActions.beginLoadComments(bugBashItemId));
        const comments: RT<typeof fetchCommentsAsync> = yield call(fetchCommentsAsync, bugBashItemId);
        yield put(CommentActions.commentsLoaded(bugBashItemId, comments));
    }
}

function* createComment(action: ActionsOfType<CommentActions, CommentActionTypes.CommentCreateRequested>): SagaIterator {
    const { bugBashItemId, commentText } = action.payload;
    yield put(CommentActions.beginCreateComment(bugBashItemId, commentText));
    try {
        const createdComment: RT<typeof createCommentAsync> = yield call(createCommentAsync, bugBashItemId, commentText);
        yield put(CommentActions.commentCreated(bugBashItemId, createdComment));
    } catch (e) {
        yield put(CommentActions.commentCreateFailed(bugBashItemId, commentText, e.message));
    }
}
