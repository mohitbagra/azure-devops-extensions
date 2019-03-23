import { BugBashItemEditorActionTypes } from "BugBashPro/Editors/BugBashItemEditor/Redux/Actions";
import { SagaIterator } from "redux-saga";
import { put, takeEvery } from "redux-saga/effects";
import { BugBashItemEditorPortalActions } from "./Actions";

export function* bugBashItemEditorPortalSaga(): SagaIterator {
    yield takeEvery(BugBashItemEditorActionTypes.RequestPortalClose, portalCloseRequested);
}

function* portalCloseRequested() {
    yield put(BugBashItemEditorPortalActions.dismissPortal());
}
