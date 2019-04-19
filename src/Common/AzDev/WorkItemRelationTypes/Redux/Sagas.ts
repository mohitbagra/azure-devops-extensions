import { LoadStatus } from "Common/Contracts";
import { RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { WorkItemRelationTypeActions, WorkItemRelationTypeActionTypes } from "./Actions";
import { fetchWorkItemRelationTypes } from "./DataSource";
import { getWorkItemRelationTypesStatus } from "./Selectors";

export function* workItemRelationTypesSaga(): SagaIterator {
    yield takeLeading(WorkItemRelationTypeActionTypes.LoadRequested, loadRelationTypes);
}

function* loadRelationTypes(): SagaIterator {
    const status: RT<typeof getWorkItemRelationTypesStatus> = yield select(getWorkItemRelationTypesStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(WorkItemRelationTypeActions.beginLoad());
        try {
            const data: RT<typeof fetchWorkItemRelationTypes> = yield call(fetchWorkItemRelationTypes);
            yield put(WorkItemRelationTypeActions.loadSucceeded(data));
        } catch (error) {
            yield put(WorkItemRelationTypeActions.loadFailed(error.message || error));
        }
    }
}
