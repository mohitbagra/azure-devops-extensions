import { LoadStatus } from "Common/Contracts";
import { RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { WorkItemTypeActions, WorkItemTypeActionTypes } from "./Actions";
import { fetchWorkItemTypes } from "./DataSource";
import { getWorkItemTypesStatus } from "./Selectors";

export function* workItemTypesSaga(): SagaIterator {
    yield takeLeading(WorkItemTypeActionTypes.LoadRequested, loadWorkItemTypes);
}

function* loadWorkItemTypes(): SagaIterator {
    const status: RT<typeof getWorkItemTypesStatus> = yield select(getWorkItemTypesStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(WorkItemTypeActions.beginLoad());
        try {
            const data: RT<typeof fetchWorkItemTypes> = yield call(fetchWorkItemTypes);
            yield put(WorkItemTypeActions.loadSucceeded(data));
        } catch (error) {
            yield put(WorkItemTypeActions.loadFailed(error.message || error));
        }
    }
}
