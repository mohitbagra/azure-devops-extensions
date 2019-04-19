import { equals } from "azure-devops-ui/Core/Util/String";
import { BugBashPortalActions } from "BugBashPro/Portals/BugBashPortal/Redux/Actions";
import { Resources } from "BugBashPro/Resources";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { navigateToBugBashItemsList } from "BugBashPro/Shared/NavHelpers";
import { BugBashesActions, BugBashesActionTypes } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { getBugBash } from "BugBashPro/Shared/Redux/BugBashes/Selectors";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import { ActionsOfType, RT } from "Common/Redux";
import { addToast } from "Common/ServiceWrappers/GlobalMessageService";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { SagaIterator } from "redux-saga";
import { all, call, put, select, take, takeEvery, takeLeading } from "redux-saga/effects";
import { BugBashEditorErrorKey, BugBashEditorNotificationKey } from "../Constants";
import { getNewBugBashInstance } from "../Helpers";
import { BugBashEditorActions, BugBashEditorActionTypes } from "./Actions";
import { getDraftBugBash, isDraftDirty, isDraftSaving, isDraftValid } from "./Selectors";

export function* bugBashEditorSaga(bugBashId: string | undefined): SagaIterator {
    yield takeLeading(BugBashEditorActionTypes.RequestDraftInitialize, requestDraftInitialize, bugBashId);
    yield takeLeading(BugBashEditorActionTypes.RequestDraftSave, requestDraftSave);

    yield takeEvery([BugBashesActionTypes.BugBashUpdateFailed, BugBashesActionTypes.BugBashCreateFailed], bugBashCreateAndUpdateFailed);
}

function* requestDraftInitialize(
    bugBashId: string | undefined,
    action: ActionsOfType<BugBashEditorActions, BugBashEditorActionTypes.RequestDraftInitialize>
): SagaIterator {
    const readFromCache = action.payload;

    if (!bugBashId) {
        yield put(BugBashEditorActions.initializeDraft({ ...getNewBugBashInstance() }));
    } else {
        const existingBugBash: RT<typeof getBugBash> = yield select(getBugBash, bugBashId);
        if (existingBugBash && readFromCache) {
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
                yield put(BugBashEditorActions.draftInitializeFailed(error));
            }
        }
    }
}

function* requestDraftSave(): SagaIterator {
    const [isDirty, isValid, isSaving, draftBugBash]: [
        RT<typeof isDraftDirty>,
        RT<typeof isDraftValid>,
        RT<typeof isDraftSaving>,
        RT<typeof getDraftBugBash>
    ] = yield all([select(isDraftDirty), select(isDraftValid), select(isDraftSaving), select(getDraftBugBash)]);

    if (draftBugBash && isValid && isDirty && !isSaving) {
        if (isNullOrWhiteSpace(draftBugBash.id)) {
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
        yield put(BugBashPortalActions.dismissPortal());
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
