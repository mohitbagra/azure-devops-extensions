import { WorkItemField, WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { FieldActions, FieldActionTypes, WorkItemTypeFieldActions, WorkItemTypeFieldActionTypes } from "./Actions";
import { fetchFields, fetchWorkItemTypeFields } from "./DataSource";
import { getFieldsStatus, getWorkItemTypeFieldsStatus } from "./Selectors";

export function* fieldsSaga(): SagaIterator {
    yield takeEvery(FieldActionTypes.LoadRequested, loadFields);
    yield takeEvery(WorkItemTypeFieldActionTypes.LoadRequested, loadWorkItemTypeFields);
}

function* loadFields(): SagaIterator {
    const status: LoadStatus = yield select(getFieldsStatus);
    if (status === LoadStatus.NotLoaded) {
        yield put(FieldActions.beginLoad());
        try {
            const data: WorkItemField[] = yield call(fetchFields);
            yield put(FieldActions.loadSucceeded(data));
        } catch (error) {
            yield put(FieldActions.loadFailed(error.message || error));
        }
    }
}

function* loadWorkItemTypeFields(action: ActionsOfType<WorkItemTypeFieldActions, WorkItemTypeFieldActionTypes.LoadRequested>): SagaIterator {
    const workItemTypeName = action.payload;
    const status: LoadStatus = yield select(getWorkItemTypeFieldsStatus, workItemTypeName);
    if (status === LoadStatus.NotLoaded) {
        yield put(WorkItemTypeFieldActions.beginLoad(workItemTypeName));
        try {
            const data: WorkItemTypeFieldWithReferences[] = yield call(fetchWorkItemTypeFields, workItemTypeName);
            yield put(WorkItemTypeFieldActions.loadSucceeded(workItemTypeName, data));
        } catch (error) {
            yield put(WorkItemTypeFieldActions.loadFailed(workItemTypeName, error.message || error));
        }
    }
}
