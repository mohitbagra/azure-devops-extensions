import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { BugBashItemEditorActions, BugBashItemEditorActionTypes } from "BugBashPro/Editors/BugBashItemEditor/Redux/Actions";
import { Resources } from "BugBashPro/Resources";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { BugBashesActionTypes } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { BugBashItemsActions, BugBashItemsActionTypes } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { getBugBashItem } from "BugBashPro/Shared/Redux/BugBashItems/Selectors";
import { ActionsOfType } from "Common/Redux";
import { addToast } from "Common/ServiceWrappers/GlobalMessageService";
import { openNewWindow } from "Common/ServiceWrappers/HostNavigationService";
import { openWorkItem } from "Common/ServiceWrappers/WorkItemNavigationService";
import { getWorkItemUrlAsync } from "Common/Utilities/UrlHelper";
import { Channel, channel, SagaIterator } from "redux-saga";
import { call, delay, put, race, select, take, takeEvery } from "redux-saga/effects";
import { BugBashItemEditorPortalActions, BugBashItemEditorPortalActionTypes } from "./Actions";

export function* bugBashItemEditorPortalSaga(): SagaIterator {
    yield takeEvery(BugBashItemEditorPortalActionTypes.Initialize, initializePortal);
    yield takeEvery(BugBashItemEditorPortalActionTypes.OpenPortalRequested, openPortalRequested);

    yield takeEvery(BugBashItemEditorActionTypes.RequestDismiss, dismissPortal);
}

function* initializePortal(action: ActionsOfType<BugBashItemEditorPortalActions, BugBashItemEditorPortalActionTypes.Initialize>) {
    const { bugBashId, initialBugBashItemId } = action.payload;

    if (initialBugBashItemId) {
        const { bugBashItemsLoaded } = yield race({
            bugBashItemsLoaded: take(BugBashItemsActionTypes.BugBashItemsLoaded),
            bugBashLoadFailed: take(BugBashesActionTypes.BugBashLoadFailed)
        });

        if (bugBashItemsLoaded) {
            yield put(BugBashItemEditorPortalActions.openPortalRequested(bugBashId, initialBugBashItemId, { readFromCache: true }));
        }
    }
}

function* openPortalRequested(action: ActionsOfType<BugBashItemEditorPortalActions, BugBashItemEditorPortalActionTypes.OpenPortalRequested>) {
    const { bugBashId, bugBashItemId, readFromCache } = action.payload;
    const bugBashItem: IBugBashItem | undefined = yield select(getBugBashItem, bugBashItemId);

    if (bugBashItem && isBugBashItemAccepted(bugBashItem)) {
        const workItem: WorkItem = yield call(openWorkItem, bugBashItem.workItemId!);
        yield put(BugBashItemsActions.bugBashItemUpdated(bugBashItem, workItem));
    } else {
        yield put(BugBashItemEditorPortalActions.openPortal(bugBashId, bugBashItemId, { readFromCache: readFromCache }));
    }
}

function* dismissPortal(action: ActionsOfType<BugBashItemEditorActions, BugBashItemEditorActionTypes.RequestDismiss>) {
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
            callbackChannel.put(BugBashItemEditorPortalActions.openPortal(bugBash.id!, bugBashItem.id!, { readFromCache: true }));
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
