import { IBugBash } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { BugBashesActions, BugBashesActionTypes } from "./Actions";
import { createBugBashAsync, deleteBugBashAsync, fetchBugBashAsync, fetchBugBashesAsync, updateBugBashAsync } from "./DataSource";
import { getBugBashesStatus, getBugBashStatus } from "./Selectors";

export function* bugBashesSaga(): SagaIterator {
    yield takeEvery(BugBashesActionTypes.BugBashesLoadRequested, loadBugBashes);
    yield takeEvery(BugBashesActionTypes.BugBashLoadRequested, loadBugBash);
    yield takeEvery(BugBashesActionTypes.BugBashCreateRequested, createBugBash);
    yield takeEvery(BugBashesActionTypes.BugBashUpdateRequested, updateBugBash);
    yield takeEvery(BugBashesActionTypes.BugBashDeleteRequested, deleteBugBash);
}

function* loadBugBashes(): SagaIterator {
    const status: LoadStatus = yield select(getBugBashesStatus);

    if (status !== LoadStatus.Loading) {
        yield put(BugBashesActions.beginLoadBugBashes());
        const data: IBugBash[] = yield call(fetchBugBashesAsync);
        yield put(BugBashesActions.bugBashesLoaded(data));
    }
}

function* loadBugBash(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashLoadRequested>): SagaIterator {
    const bugBashId = action.payload;
    const status: LoadStatus = yield select(getBugBashStatus, bugBashId);

    if (status !== LoadStatus.Loading && status !== LoadStatus.Updating) {
        yield put(BugBashesActions.beginLoadBugBash(bugBashId));
        try {
            const data: IBugBash = yield call(fetchBugBashAsync, bugBashId);
            yield put(BugBashesActions.bugBashLoaded(data));
        } catch (e) {
            yield put(BugBashesActions.bugBashLoadFailed(bugBashId, e.message));
        }
    }
}

function* createBugBash(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashCreateRequested>): SagaIterator {
    const bugBash = action.payload;

    yield put(BugBashesActions.beginCreateBugBash(bugBash));
    try {
        const createdBugBash: IBugBash = yield call(createBugBashAsync, bugBash);
        yield put(BugBashesActions.bugBashCreated(createdBugBash));
    } catch (e) {
        yield put(BugBashesActions.bugBashCreateFailed(bugBash, e.message));
    }
}

function* updateBugBash(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashUpdateRequested>): SagaIterator {
    const bugBash = action.payload;

    const status: LoadStatus = yield select(getBugBashStatus, bugBash.id!);
    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed) {
        yield put(BugBashesActions.beginUpdateBugBash(bugBash));
        try {
            const updatedBugBash: IBugBash = yield call(updateBugBashAsync, bugBash);
            yield put(BugBashesActions.bugBashUpdated(updatedBugBash));
        } catch (e) {
            yield put(BugBashesActions.bugBashUpdateFailed(bugBash, e.message));
        }
    }
}

function* deleteBugBash(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashDeleteRequested>): SagaIterator {
    const bugBashId = action.payload;

    const status: LoadStatus = yield select(getBugBashStatus, bugBashId);
    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed || status === LoadStatus.LoadFailed) {
        yield put(BugBashesActions.beginDeleteBugBash(bugBashId));
        try {
            yield call(deleteBugBashAsync, bugBashId);
            yield put(BugBashesActions.bugBashDeleted(bugBashId));
        } catch (e) {
            yield put(BugBashesActions.bugBashDeleteFailed(bugBashId, e.message));
        }
    }
}
