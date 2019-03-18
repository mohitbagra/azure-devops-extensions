import { equals } from "azure-devops-ui/Core/Util/String";
import { BugBashesActions, BugBashesActionTypes, getBugBash } from "BugBashPro/Redux/BugBashes";
import { Resources } from "BugBashPro/Resources";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { getNewBugBashInstance } from "BugBashPro/Shared/Helpers";
import { navigateToBugBashItemsList } from "BugBashPro/Shared/NavHelpers";
import { KeyValuePairActions } from "Common/Notifications/Redux";
import { ActionsOfType } from "Common/Redux";
import { addToast } from "Common/ServiceWrappers/GlobalMessageService";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { SagaIterator } from "redux-saga";
import { all, call, put, select, take, takeEvery } from "redux-saga/effects";
import { BugBashEditorErrorKey, BugBashEditorNotificationKey } from "../../Constants";
import { BugBashEditorPortalActions } from "../Portal";
import { BugBashEditorActions, BugBashEditorActionTypes } from "./Actions";
import { getDraftBugBash, isDraftDirty, isDraftSaving, isDraftValid } from "./Selectors";

export function* bugBashEditorSaga(): SagaIterator {
    yield takeEvery(BugBashEditorActionTypes.RequestDraftInitialize, requestDraftInitialize);
    yield takeEvery(BugBashEditorActionTypes.RequestDraftSave, requestDraftSave);

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

function* requestDraftSave(action: ActionsOfType<BugBashEditorActions, BugBashEditorActionTypes.RequestDraftSave>): SagaIterator {
    const bugBashId = action.payload;
    const [isDirty, isValid, isSaving, draftBugBash] = yield all([
        select(isDraftDirty, bugBashId),
        select(isDraftValid, bugBashId),
        select(isDraftSaving, bugBashId),
        select(getDraftBugBash, bugBashId)
    ]);

    if (isValid && isDirty && !isSaving) {
        if (isNullOrWhiteSpace(bugBashId)) {
            yield call(requestDraftCreate, draftBugBash);
        } else {
            yield call(requestDraftUpdate, draftBugBash);
        }
    }
}

function* requestDraftCreate(draftBugBash: IBugBash) {
    yield put(BugBashesActions.bugBashCreateRequested(draftBugBash));

    const itemCreatedAction: ActionsOfType<
        BugBashesActions,
        BugBashesActionTypes.BugBashCreated | BugBashesActionTypes.BugBashCreateFailed
    > = yield take(
        (action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashCreated | BugBashesActionTypes.BugBashCreateFailed>): boolean => {
            return action.type === BugBashesActionTypes.BugBashCreated || action.type === BugBashesActionTypes.BugBashCreateFailed;
        }
    );

    if (itemCreatedAction.type === BugBashesActionTypes.BugBashCreated) {
        const createdBugBash = itemCreatedAction.payload;
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
}

function* requestDraftUpdate(draftBugBash: IBugBash) {
    yield put(BugBashesActions.bugBashUpdateRequested(draftBugBash));

    const itemUpdatedAction: ActionsOfType<
        BugBashesActions,
        BugBashesActionTypes.BugBashUpdated | BugBashesActionTypes.BugBashUpdateFailed
    > = yield take(
        (action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashUpdated | BugBashesActionTypes.BugBashUpdateFailed>): boolean => {
            if (action.type === BugBashesActionTypes.BugBashUpdated) {
                return equals(action.payload.id!, draftBugBash.id!, true);
            } else if (action.type === BugBashesActionTypes.BugBashUpdateFailed) {
                return equals(action.payload.bugBash.id!, draftBugBash.id!, true);
            }

            return false;
        }
    );

    if (itemUpdatedAction.type === BugBashesActionTypes.BugBashUpdated) {
        yield put(BugBashEditorActions.draftSaveSucceeded(itemUpdatedAction.payload));
        yield put(KeyValuePairActions.pushEntry(BugBashEditorNotificationKey, "Saved"));
    }
}

function* bugBashCreateAndUpdateFailed(
    action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashCreateFailed | BugBashesActionTypes.BugBashUpdateFailed>
): SagaIterator {
    const { error } = action.payload;
    yield put(KeyValuePairActions.pushEntry(BugBashEditorErrorKey, error));
}
