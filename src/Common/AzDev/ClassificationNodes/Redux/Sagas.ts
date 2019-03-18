import { WorkItemClassificationNode } from "azure-devops-extension-api/WorkItemTracking";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
    AreaPathActions, AreaPathActionTypes, IterationPathActions, IterationPathActionTypes
} from "./Actions";
import { IClassificationNode } from "./Contracts";
import { fetchAreaPaths, fetchIterationPaths } from "./DataSource";
import {
    areAreaPathsLoading, areIterationPathsLoading, getAreaPathRootNode, getIterationPathRootNode
} from "./Selectors";

export function* classificationNodesSaga(): SagaIterator {
    yield takeEvery(AreaPathActionTypes.LoadRequested, loadAreaPaths);
    yield takeEvery(IterationPathActionTypes.LoadRequested, loadIterationPaths);
}

function* loadAreaPaths(): SagaIterator {
    const rootNode: IClassificationNode | undefined = yield select(getAreaPathRootNode);
    const areLoading: boolean = yield select(areAreaPathsLoading);
    if (!rootNode && !areLoading) {
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
    const rootNode: IClassificationNode | undefined = yield select(getIterationPathRootNode);
    const areLoading: boolean = yield select(areIterationPathsLoading);
    if (!rootNode && !areLoading) {
        yield put(IterationPathActions.beginLoad());
        try {
            const data: WorkItemClassificationNode = yield call(fetchIterationPaths);
            yield put(IterationPathActions.loadSucceeded(data));
        } catch (error) {
            yield put(IterationPathActions.loadFailed(error.message || error));
        }
    }
}
