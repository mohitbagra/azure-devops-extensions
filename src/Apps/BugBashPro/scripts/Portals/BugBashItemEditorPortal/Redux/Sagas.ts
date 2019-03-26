import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { BugBashItemEditorActions, BugBashItemEditorActionTypes } from "BugBashPro/Editors/BugBashItemEditor/Redux/Actions";
import { Resources } from "BugBashPro/Resources";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { ActionsOfType } from "Common/Redux";
import { addToast } from "Common/ServiceWrappers/GlobalMessageService";
import { openNewWindow } from "Common/ServiceWrappers/HostNavigationService";
import { openWorkItem } from "Common/ServiceWrappers/WorkItemNavigationService";
import { getWorkItemUrlAsync } from "Common/Utilities/UrlHelper";
import { Channel, channel, SagaIterator } from "redux-saga";
import { call, delay, put, race, take, takeEvery } from "redux-saga/effects";
import { BugBashItemEditorPortalActions, BugBashItemEditorPortalActionTypes } from "./Actions";

export function* bugBashItemEditorPortalSaga(): SagaIterator {
    yield takeEvery(BugBashItemEditorActionTypes.RequestPortalClose, portalCloseRequested);
    yield takeEvery(BugBashItemEditorPortalActionTypes.OpenPortal, openPortalRequested);
}

function* portalCloseRequested(action: ActionsOfType<BugBashItemEditorActions, BugBashItemEditorActionTypes.RequestPortalClose>) {
    const { bugBash, bugBashItem } = action.payload;

    yield put(BugBashItemEditorPortalActions.dismissPortal());

    if (bugBashItem.workItemId) {
        const workItemUrl: string = yield call(getWorkItemUrlAsync, bugBashItem.workItemId);
        yield call(addToast, {
            message: Resources.BugBashAcceptedCreatedMessage,
            callToAction: Resources.View,
            duration: 5000,
            forceOverrideExisting: true,
            onCallToActionClick: () => {
                openNewWindow(workItemUrl);
            }
        });
    } else {
        const callbackChannel: Channel<BugBashItemEditorPortalActions> = yield call(channel);
        const callback = () => {
            callbackChannel.put(BugBashItemEditorPortalActions.openPortal(bugBash, bugBashItem));
        };

        yield call(addToast, {
            message: Resources.BugBashItemCreatedMessage,
            callToAction: Resources.View,
            duration: 5000,
            forceOverrideExisting: true,
            onCallToActionClick: callback
        });
        const { message } = yield race({
            message: take(callbackChannel),
            timeout: delay(5000)
        });

        if (message) {
            yield put(message);
        }
        yield call([callbackChannel, callbackChannel.close]);
    }
}

function* openPortalRequested(action: ActionsOfType<BugBashItemEditorPortalActions, BugBashItemEditorPortalActionTypes.OpenPortal>) {
    const { bugBashItem } = action.payload;

    if (bugBashItem && isBugBashItemAccepted(bugBashItem)) {
        const workItem: WorkItem = yield call(openWorkItem, bugBashItem.workItemId!);
        yield put(BugBashItemsActions.bugBashItemUpdated(bugBashItem, workItem));
    }
}
