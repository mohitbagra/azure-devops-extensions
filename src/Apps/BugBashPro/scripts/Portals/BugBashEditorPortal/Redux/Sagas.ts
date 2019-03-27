import { BugBashEditorActions, BugBashEditorActionTypes } from "BugBashPro/Editors/BugBashEditor/Redux/Actions";
import { Resources } from "BugBashPro/Resources";
import { navigateToBugBashItemsList } from "BugBashPro/Shared/NavHelpers";
import { ActionsOfType } from "Common/Redux";
import { addToast } from "Common/ServiceWrappers/GlobalMessageService";
import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import { BugBashEditorPortalActions } from "./Actions";

export function* bugBashEditorPortalSaga(): SagaIterator {
    yield takeEvery(BugBashEditorActionTypes.RequestDismiss, dismissPortal);
}

function* dismissPortal(action: ActionsOfType<BugBashEditorActions, BugBashEditorActionTypes.RequestDismiss>) {
    const bugBashId = action.payload;
    yield put(BugBashEditorPortalActions.dismissPortal());

    yield call(addToast, {
        message: Resources.BugBashCreatedMessage,
        callToAction: Resources.View,
        duration: 5000,
        forceOverrideExisting: true,
        onCallToActionClick: () => {
            navigateToBugBashItemsList(bugBashId);
        }
    });
}
