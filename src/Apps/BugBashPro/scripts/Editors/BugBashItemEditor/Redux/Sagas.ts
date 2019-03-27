import { equals } from "azure-devops-ui/Core/Util/String";
import { IBugBash, IBugBashItem } from "BugBashPro/Shared/Contracts";
import { BugBashItemsActions, BugBashItemsActionTypes, getBugBashItem } from "BugBashPro/Shared/Redux/BugBashItems";
import { CommentActions, CommentActionTypes } from "BugBashPro/Shared/Redux/Comments";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import { ActionsOfType } from "Common/Redux";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { SagaIterator } from "redux-saga";
import { all, call, put, race, select, take, takeEvery } from "redux-saga/effects";
import { BugBashItemEditorErrorKey, BugBashItemEditorNotificationKey } from "../Constants";
import { getNewBugBashItemInstance } from "../Helpers";
import { BugBashItemEditorActions, BugBashItemEditorActionTypes } from "./Actions";
import { getDraftBugBashItem, getDraftComment, isDraftDirty, isDraftSaving, isDraftValid } from "./Selectors";

export function* bugBashItemEditorSaga(): SagaIterator {
    yield takeEvery(BugBashItemEditorActionTypes.RequestDraftInitialize, requestDraftInitialize);
    yield takeEvery(BugBashItemEditorActionTypes.RequestDraftSave, requestDraftSave);
    yield takeEvery(BugBashItemEditorActionTypes.RequestDraftAccept, requestDraftAccept);

    yield takeEvery(BugBashItemsActionTypes.BugBashItemCreateFailed, bugBashItemCreateAndUpdateFailed);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemUpdateFailed, bugBashItemCreateAndUpdateFailed);
}

function* requestDraftInitialize(action: ActionsOfType<BugBashItemEditorActions, BugBashItemEditorActionTypes.RequestDraftInitialize>): SagaIterator {
    const { bugBash, bugBashItemId, readFromCache } = action.payload;

    if (!bugBashItemId) {
        yield put(BugBashItemEditorActions.initializeDraft({ ...getNewBugBashItemInstance(bugBash.id!, bugBash.defaultTeam) }));
    } else {
        const existingBugBashItem: IBugBashItem | undefined = yield select(getBugBashItem, bugBashItemId);
        if (existingBugBashItem && readFromCache) {
            yield put(BugBashItemEditorActions.initializeDraft(existingBugBashItem));
        } else {
            yield put(BugBashItemsActions.bugBashItemLoadRequested(bugBash.id!, bugBashItemId));
            const itemLoadedAction: ActionsOfType<
                BugBashItemsActions,
                BugBashItemsActionTypes.BugBashItemLoaded | BugBashItemsActionTypes.BugBashItemLoadFailed
            > = yield take(
                (
                    action: ActionsOfType<
                        BugBashItemsActions,
                        BugBashItemsActionTypes.BugBashItemLoaded | BugBashItemsActionTypes.BugBashItemLoadFailed
                    >
                ): boolean => {
                    if (action.type === BugBashItemsActionTypes.BugBashItemLoaded && equals(action.payload.bugBashItem.id!, bugBashItemId, true)) {
                        return true;
                    } else if (
                        action.type === BugBashItemsActionTypes.BugBashItemLoadFailed &&
                        equals(action.payload.bugBashItemId, bugBashItemId, true)
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            );

            if (itemLoadedAction.type === BugBashItemsActionTypes.BugBashItemLoaded) {
                yield put(BugBashItemEditorActions.initializeDraft(itemLoadedAction.payload.bugBashItem));
            } else {
                const error = itemLoadedAction.payload.error;
                yield put(BugBashItemEditorActions.draftInitializeFailed(bugBash, bugBashItemId, error));
            }
        }
    }
}

function* requestDraftSave(action: ActionsOfType<BugBashItemEditorActions, BugBashItemEditorActionTypes.RequestDraftSave>): SagaIterator {
    const { bugBash, bugBashItemId } = action.payload;
    const [isDirty, isValid, isSaving, draftBugBashItem, draftComment] = yield all([
        select(isDraftDirty, bugBashItemId),
        select(isDraftValid, bugBashItemId),
        select(isDraftSaving, bugBashItemId),
        select(getDraftBugBashItem, bugBashItemId),
        select(getDraftComment, bugBashItemId)
    ]);

    if (isValid && isDirty && !isSaving) {
        if (isNullOrWhiteSpace(bugBashItemId)) {
            yield call(requestDraftCreate, bugBash, draftBugBashItem, draftComment);
        } else {
            yield call(requestDraftUpdate, draftBugBashItem, draftComment);
        }
    }
}

function* requestDraftCreate(bugBash: IBugBash, draftBugBashItem: IBugBashItem, draftComment: string | undefined) {
    yield put(BugBashItemsActions.bugBashItemCreateRequested(draftBugBashItem));

    const itemCreatedAction: ActionsOfType<
        BugBashItemsActions,
        BugBashItemsActionTypes.BugBashItemCreated | BugBashItemsActionTypes.BugBashItemCreateFailed
    > = yield take(
        (
            action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemCreated | BugBashItemsActionTypes.BugBashItemCreateFailed>
        ): boolean => {
            return action.type === BugBashItemsActionTypes.BugBashItemCreated || action.type === BugBashItemsActionTypes.BugBashItemCreateFailed;
        }
    );

    if (itemCreatedAction.type === BugBashItemsActionTypes.BugBashItemCreated) {
        const { bugBashItem: createdBugBashItem } = itemCreatedAction.payload;

        if (draftComment) {
            yield put(CommentActions.commentCreateRequested(createdBugBashItem.id!, draftComment));
            yield race([take(CommentActionTypes.CommentCreated), take(CommentActionTypes.CommentCreateFailed)]);
        }
        yield put(BugBashItemEditorActions.requestDismiss(bugBash, createdBugBashItem));
    }
}

function* requestDraftUpdate(draftBugBashItem: IBugBashItem, draftComment: string | undefined) {
    yield put(BugBashItemsActions.bugBashItemUpdateRequested(draftBugBashItem));

    const itemUpdatedAction: ActionsOfType<
        BugBashItemsActions,
        BugBashItemsActionTypes.BugBashItemUpdated | BugBashItemsActionTypes.BugBashItemUpdateFailed
    > = yield take(
        (
            action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemUpdated | BugBashItemsActionTypes.BugBashItemUpdateFailed>
        ): boolean => {
            return (
                (action.type === BugBashItemsActionTypes.BugBashItemUpdated || action.type === BugBashItemsActionTypes.BugBashItemUpdateFailed) &&
                equals(action.payload.bugBashItem.id!, draftBugBashItem.id!, true)
            );
        }
    );

    if (itemUpdatedAction.type === BugBashItemsActionTypes.BugBashItemUpdated) {
        const { bugBashItem: updatedBugBashItem } = itemUpdatedAction.payload;
        if (draftComment) {
            yield put(CommentActions.commentCreateRequested(updatedBugBashItem.id!, draftComment));
            yield race([take(CommentActionTypes.CommentCreated), take(CommentActionTypes.CommentCreateFailed)]);
        }

        yield put(BugBashItemEditorActions.draftSaveSucceeded(updatedBugBashItem));
        yield put(KeyValuePairActions.pushEntry(BugBashItemEditorNotificationKey, "Saved"));
    }
}

function* requestDraftAccept(action: ActionsOfType<BugBashItemEditorActions, BugBashItemEditorActionTypes.RequestDraftAccept>) {
    const { bugBash, bugBashItemId } = action.payload;
    if (isNullOrWhiteSpace(bugBashItemId)) {
        return;
    }
    const [isDirty, isValid, isSaving, draftBugBashItem] = yield all([
        select(isDraftDirty, bugBashItemId),
        select(isDraftValid, bugBashItemId),
        select(isDraftSaving, bugBashItemId),
        select(getDraftBugBashItem, bugBashItemId)
    ]);

    if (isValid && !isDirty && !isSaving) {
        yield put(BugBashItemsActions.bugBashItemAcceptRequested(bugBash, draftBugBashItem));

        const itemUpdatedAction: ActionsOfType<
            BugBashItemsActions,
            BugBashItemsActionTypes.BugBashItemUpdated | BugBashItemsActionTypes.BugBashItemUpdateFailed
        > = yield take(
            (
                action: ActionsOfType<
                    BugBashItemsActions,
                    BugBashItemsActionTypes.BugBashItemUpdated | BugBashItemsActionTypes.BugBashItemUpdateFailed
                >
            ): boolean => {
                return (
                    (action.type === BugBashItemsActionTypes.BugBashItemUpdated || action.type === BugBashItemsActionTypes.BugBashItemUpdateFailed) &&
                    equals(action.payload.bugBashItem.id!, draftBugBashItem.id, true)
                );
            }
        );

        if (itemUpdatedAction.type === BugBashItemsActionTypes.BugBashItemUpdated) {
            const { bugBashItem: acceptedBugBashItem } = itemUpdatedAction.payload;
            yield put(BugBashItemEditorActions.requestDismiss(bugBash, acceptedBugBashItem));
        }
    }
}

function* bugBashItemCreateAndUpdateFailed(
    action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemCreateFailed | BugBashItemsActionTypes.BugBashItemUpdateFailed>
): SagaIterator {
    const { error } = action.payload;
    yield put(KeyValuePairActions.pushEntry(BugBashItemEditorErrorKey, error));
}
