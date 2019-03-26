import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { BugBashItemEditorActionTypes } from "BugBashPro/Editors/BugBashItemEditor/Redux/Actions";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { ActionsOfType } from "Common/Redux";
import { openWorkItem } from "Common/ServiceWrappers/WorkItemNavigationService";
import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import { BugBashItemEditorPortalActions, BugBashItemEditorPortalActionTypes } from "./Actions";

export function* bugBashItemEditorPortalSaga(): SagaIterator {
    yield takeEvery(BugBashItemEditorActionTypes.RequestPortalClose, portalCloseRequested);
    yield takeEvery(BugBashItemEditorPortalActionTypes.OpenPortal, openPortalRequested);
}

function* portalCloseRequested() {
    yield put(BugBashItemEditorPortalActions.dismissPortal());
}

function* openPortalRequested(action: ActionsOfType<BugBashItemEditorPortalActions, BugBashItemEditorPortalActionTypes.OpenPortal>) {
    const { bugBashItem } = action.payload;

    if (bugBashItem && isBugBashItemAccepted(bugBashItem)) {
        const workItem: WorkItem = yield call(openWorkItem, bugBashItem.workItemId!);
        yield put(BugBashItemsActions.bugBashItemLoaded(bugBashItem, workItem));
    }
}
