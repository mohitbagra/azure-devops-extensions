import { BugBashEditorActionTypes } from "BugBashPro/Editors/BugBashEditor/Redux/Actions";
import { SagaIterator } from "redux-saga";
import { put, takeEvery } from "redux-saga/effects";
import { BugBashEditorPortalActions } from "./Actions";

export function* bugBashEditorPortalSaga(): SagaIterator {
    yield takeEvery(BugBashEditorActionTypes.RequestPortalClose, portalCloseRequested);
}

function* portalCloseRequested() {
    yield put(BugBashEditorPortalActions.dismissPortal());
}
