import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { WorkItemRelationTypeActions, WorkItemRelationTypeActionTypes } from "./Actions";
import { fetchWorkItemRelationTypes } from "./DataSource";
import { areWorkItemRelationTypesLoading, getWorkItemRelationTypes } from "./Selectors";

export function* workItemRelationTypesSaga(): SagaIterator {
    yield takeEvery(WorkItemRelationTypeActionTypes.LoadRequested, loadRelationTypes);
}

function* loadRelationTypes(): SagaIterator {
    const relationTypes: WorkItemRelationType[] | undefined = yield select(getWorkItemRelationTypes);
    const areLoading: boolean = yield select(areWorkItemRelationTypesLoading);
    if (!relationTypes && !areLoading) {
        yield put(WorkItemRelationTypeActions.beginLoad());
        try {
            const data: WorkItemRelationType[] = yield call(fetchWorkItemRelationTypes);
            yield put(WorkItemRelationTypeActions.loadSucceeded(data));
        } catch (error) {
            yield put(WorkItemRelationTypeActions.loadFailed(error.message || error));
        }
    }
}
