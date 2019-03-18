import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { WorkItemRelationTypeActions, WorkItemRelationTypeActionTypes } from "./Actions";
import { fetchWorkItemRelationTypes } from "./DataSource";
import { getWorkItemRelationTypesStatus } from "./Selectors";

export function* workItemRelationTypesSaga(): SagaIterator {
    yield takeEvery(WorkItemRelationTypeActionTypes.LoadRequested, loadRelationTypes);
}

function* loadRelationTypes(): SagaIterator {
    const status: LoadStatus = yield select(getWorkItemRelationTypesStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(WorkItemRelationTypeActions.beginLoad());
        try {
            const data: WorkItemRelationType[] = yield call(fetchWorkItemRelationTypes);
            yield put(WorkItemRelationTypeActions.loadSucceeded(data));
        } catch (error) {
            yield put(WorkItemRelationTypeActions.loadFailed(error.message || error));
        }
    }
}
