import { WorkItemClassificationNode } from "azure-devops-extension-api/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { AreaPathActions, AreaPathActionTypes, IterationPathActions, IterationPathActionTypes } from "./Actions";
import { fetchAreaPaths, fetchIterationPaths } from "./DataSource";
import { getAreaPathStatus, getIterationPathStatus } from "./Selectors";

export function* classificationNodesSaga(): SagaIterator {
    yield takeEvery(AreaPathActionTypes.LoadRequested, loadAreaPaths);
    yield takeEvery(IterationPathActionTypes.LoadRequested, loadIterationPaths);
}

function* loadAreaPaths(): SagaIterator {
    const status: LoadStatus = yield select(getAreaPathStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(AreaPathActions.beginLoad());
        try {
            const data: WorkItemClassificationNode = yield call(fetchAreaPaths);
            yield put(AreaPathActions.loadSucceeded(data));
        } catch (error) {
            yield put(AreaPathActions.loadFailed(error.message || error));
        }
    }
}

function* loadIterationPaths(): SagaIterator {
    const status: LoadStatus = yield select(getIterationPathStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(IterationPathActions.beginLoad());
        try {
            const data: WorkItemClassificationNode = yield call(fetchIterationPaths);
            yield put(IterationPathActions.loadSucceeded(data));
        } catch (error) {
            yield put(IterationPathActions.loadFailed(error.message || error));
        }
    }
}
