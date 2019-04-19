import { LoadStatus } from "Common/Contracts";
import { RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { AreaPathActions, AreaPathActionTypes, IterationPathActions, IterationPathActionTypes } from "./Actions";
import { fetchAreaPaths, fetchIterationPaths } from "./DataSource";
import { getAreaPathStatus, getIterationPathStatus } from "./Selectors";

export function* classificationNodesSaga(): SagaIterator {
    yield takeLeading(AreaPathActionTypes.LoadRequested, loadAreaPaths);
    yield takeLeading(IterationPathActionTypes.LoadRequested, loadIterationPaths);
}

function* loadAreaPaths(): SagaIterator {
    const status: RT<typeof getAreaPathStatus> = yield select(getAreaPathStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(AreaPathActions.beginLoad());
        try {
            const data: RT<typeof fetchAreaPaths> = yield call(fetchAreaPaths);
            yield put(AreaPathActions.loadSucceeded(data));
        } catch (error) {
            yield put(AreaPathActions.loadFailed(error.message || error));
        }
    }
}

function* loadIterationPaths(): SagaIterator {
    const status: RT<typeof getIterationPathStatus> = yield select(getIterationPathStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(IterationPathActions.beginLoad());
        try {
            const data: RT<typeof fetchIterationPaths> = yield call(fetchIterationPaths);
            yield put(IterationPathActions.loadSucceeded(data));
        } catch (error) {
            yield put(IterationPathActions.loadFailed(error.message || error));
        }
    }
}
