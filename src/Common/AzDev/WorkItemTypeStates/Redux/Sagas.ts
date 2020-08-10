import { ActionsOfType, RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";

import { WorkItemTypeStateActions, WorkItemTypeStateActionTypes } from "./Actions";
import { fetchWorkItemTypeStates } from "./DataSource";
import { getWorkItemTypeStates } from "./Selectors";

function* loadWorkItemTypeStates(action: ActionsOfType<WorkItemTypeStateActions, WorkItemTypeStateActionTypes.LoadRequested>): SagaIterator {
    const workItemTypeName = action.payload;
    const workItemTypeStates: RT<typeof getWorkItemTypeStates> = yield select(getWorkItemTypeStates, workItemTypeName);
    if (!workItemTypeStates) {
        yield put(WorkItemTypeStateActions.beginLoad(workItemTypeName));
        try {
            const data: RT<typeof fetchWorkItemTypeStates> = yield call(fetchWorkItemTypeStates, workItemTypeName);
            yield put(WorkItemTypeStateActions.loadSucceeded(workItemTypeName, data));
        } catch (error) {
            yield put(WorkItemTypeStateActions.loadFailed(workItemTypeName, error.message || error));
        }
    }
}

export function* workItemTypeStatesSaga(): SagaIterator {
    yield takeEvery(WorkItemTypeStateActionTypes.LoadRequested, loadWorkItemTypeStates);
}
