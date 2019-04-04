import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { WorkItemTypeActions, WorkItemTypeActionTypes } from "./Actions";
import { fetchWorkItemTypes } from "./DataSource";
import { getWorkItemTypesStatus } from "./Selectors";

export function* workItemTypesSaga(): SagaIterator {
    yield takeEvery(WorkItemTypeActionTypes.LoadRequested, loadWorkItemTypes);
}

function* loadWorkItemTypes(): SagaIterator {
    const status: LoadStatus = yield select(getWorkItemTypesStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(WorkItemTypeActions.beginLoad());
        try {
            const data: WorkItemType[] = yield call(fetchWorkItemTypes);
            yield put(WorkItemTypeActions.loadSucceeded(data));
        } catch (error) {
            yield put(WorkItemTypeActions.loadFailed(error.message || error));
        }
    }
}
