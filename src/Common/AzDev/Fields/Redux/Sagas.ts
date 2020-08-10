import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects";

import { FieldActions, FieldActionTypes, WorkItemTypeFieldActions, WorkItemTypeFieldActionTypes } from "./Actions";
import { fetchFields, fetchWorkItemTypeFields } from "./DataSource";
import { getFieldsStatus, getWorkItemTypeFieldsStatus } from "./Selectors";

function* loadFields(): SagaIterator {
    const status: RT<typeof getFieldsStatus> = yield select(getFieldsStatus);
    if (status === LoadStatus.NotLoaded) {
        yield put(FieldActions.beginLoad());
        try {
            const data: RT<typeof fetchFields> = yield call(fetchFields);
            yield put(FieldActions.loadSucceeded(data));
        } catch (error) {
            yield put(FieldActions.loadFailed(error.message || error));
        }
    }
}

function* loadWorkItemTypeFields(action: ActionsOfType<WorkItemTypeFieldActions, WorkItemTypeFieldActionTypes.LoadRequested>): SagaIterator {
    const workItemTypeName = action.payload;
    const status: RT<typeof getWorkItemTypeFieldsStatus> = yield select(getWorkItemTypeFieldsStatus, workItemTypeName);
    if (status === LoadStatus.NotLoaded) {
        yield put(WorkItemTypeFieldActions.beginLoad(workItemTypeName));
        try {
            const data: RT<typeof fetchWorkItemTypeFields> = yield call(fetchWorkItemTypeFields, workItemTypeName);
            yield put(WorkItemTypeFieldActions.loadSucceeded(workItemTypeName, data));
        } catch (error) {
            yield put(WorkItemTypeFieldActions.loadFailed(workItemTypeName, error.message || error));
        }
    }
}

export function* fieldsSaga(): SagaIterator {
    yield takeLeading(FieldActionTypes.LoadRequested, loadFields);
    yield takeEvery(WorkItemTypeFieldActionTypes.LoadRequested, loadWorkItemTypeFields);
}
