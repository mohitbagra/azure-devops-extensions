import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { WorkItemTypeActions, WorkItemTypeActionTypes } from "./Actions";
import { fetchWorkItemTypes } from "./DataSource";
import { areWorkItemTypesLoading, getWorkItemTypes } from "./Selectors";

export function* workItemTypesSaga(): SagaIterator {
    yield takeEvery(WorkItemTypeActionTypes.LoadRequested, loadWorkItemTypes);
}

function* loadWorkItemTypes(): SagaIterator {
    const workItemTypes: WorkItemType[] | undefined = yield select(getWorkItemTypes);
    const areLoading: boolean = yield select(areWorkItemTypesLoading);
    if (!workItemTypes && !areLoading) {
        yield put(WorkItemTypeActions.beginLoad());
        try {
            const data: WorkItemType[] = yield call(fetchWorkItemTypes);
            yield put(WorkItemTypeActions.loadSucceeded(data));
        } catch (error) {
            yield put(WorkItemTypeActions.loadFailed(error.message || error));
        }
    }
}
