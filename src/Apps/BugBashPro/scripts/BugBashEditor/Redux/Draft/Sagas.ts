import { equals } from "azure-devops-ui/Core/Util/String";
import { BugBashesActions, BugBashesActionTypes, getBugBash } from "BugBashPro/Redux/BugBashes";
import { Resources } from "BugBashPro/Resources";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { getNewBugBashInstance } from "BugBashPro/Shared/Helpers";
import { navigateToBugBashItemsList } from "BugBashPro/Shared/NavHelpers";
import { ActionsOfType } from "Common/Redux/Helpers";
import { KeyValurPairActions } from "Common/Redux/KeyValuePair";
import { addToast } from "Common/ServiceWrappers/GlobalMessageService";
import { SagaIterator } from "redux-saga";
import { call, put, select, take, takeEvery } from "redux-saga/effects";
import { BugBashEditorErrorKey, BugBashEditorNotificationKey } from "../../Constants";
import { BugBashEditorPortalActions } from "../Portal";
import { BugBashEditorActions, BugBashEditorActionTypes } from "./Actions";

export function* bugBashEditorSaga(): SagaIterator {
    yield takeEvery(BugBashEditorActionTypes.RequestDraftInitialize, requestDraftInitialize);

    yield takeEvery(BugBashesActionTypes.BugBashCreated, bugBashCreated);
    yield takeEvery(BugBashesActionTypes.BugBashUpdated, bugBashUpdated);
    yield takeEvery(BugBashesActionTypes.BugBashCreateFailed, bugBashCreateAndUpdateFailed);
    yield takeEvery(BugBashesActionTypes.BugBashUpdateFailed, bugBashCreateAndUpdateFailed);
}

function* requestDraftInitialize(action: ActionsOfType<BugBashEditorActions, BugBashEditorActionTypes.RequestDraftInitialize>): SagaIterator {
    const { bugBashId, useCached } = action.payload;

    if (!bugBashId) {
        yield put(BugBashEditorActions.initializeDraft({ ...getNewBugBashInstance() }));
    } else {
        const existingBugBash: IBugBash | undefined = yield select(getBugBash, bugBashId);
        if (existingBugBash && useCached) {
            yield put(BugBashEditorActions.initializeDraft(existingBugBash));
        } else {
            yield put(BugBashesActions.bugBashLoadRequested(bugBashId));
            const loadedAction: ActionsOfType<
                BugBashesActions,
                BugBashesActionTypes.BugBashLoaded | BugBashesActionTypes.BugBashLoadFailed
            > = yield take(
                (action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashLoaded | BugBashesActionTypes.BugBashLoadFailed>): boolean => {
                    if (action.type === BugBashesActionTypes.BugBashLoaded && equals(action.payload.id!, bugBashId, true)) {
                        return true;
                    } else if (action.type === BugBashesActionTypes.BugBashLoadFailed && equals(action.payload.bugBashId, bugBashId, true)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            );

            if (loadedAction.type === BugBashesActionTypes.BugBashLoaded) {
                yield put(BugBashEditorActions.initializeDraft(loadedAction.payload));
            } else {
                const error = loadedAction.payload.error;
                yield put(BugBashEditorActions.draftInitializeFailed(bugBashId, error));
            }
        }
    }
}

function* bugBashCreated(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashCreated>): SagaIterator {
    const createdBugBash = action.payload;
    yield call(addToast, {
        message: Resources.BugBashCreatedMessage,
        callToAction: Resources.View,
        duration: 5000,
        forceOverrideExisting: true,
        onCallToActionClick: () => {
            navigateToBugBashItemsList(createdBugBash.id!);
        }
    });
    yield put(BugBashEditorPortalActions.dismissPortal());
}

function* bugBashUpdated(): SagaIterator {
    yield put(KeyValurPairActions.pushEntry(BugBashEditorNotificationKey, "Saved"));
}

function* bugBashCreateAndUpdateFailed(
    action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashCreateFailed | BugBashesActionTypes.BugBashUpdateFailed>
): SagaIterator {
    const { error } = action.payload;
    yield put(KeyValurPairActions.pushEntry(BugBashEditorErrorKey, error));
}
