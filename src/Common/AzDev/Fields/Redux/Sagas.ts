import { WorkItemField, WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking";
import { ActionsOfType } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { FieldActions, FieldActionTypes, WorkItemTypeFieldActions, WorkItemTypeFieldActionTypes } from "./Actions";
import { fetchFields, fetchWorkItemTypeFields } from "./DataSource";
import { areFieldsLoading, getFields, getWorkItemTypeFields } from "./Selectors";

export function* fieldsSaga(): SagaIterator {
    yield takeEvery(FieldActionTypes.LoadRequested, loadFields);
    yield takeEvery(WorkItemTypeFieldActionTypes.LoadRequested, loadWorkItemTypeFields);
}

function* loadFields(): SagaIterator {
    const fields: WorkItemField[] | undefined = yield select(getFields);
    const areLoading: boolean = yield select(areFieldsLoading);
    if (!fields && !areLoading) {
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
    const workItemTypeFields: WorkItemField[] | undefined = yield select(getWorkItemTypeFields, workItemTypeName);
    if (!workItemTypeFields) {
        yield put(WorkItemTypeFieldActions.beginLoad(workItemTypeName));
        try {
            const data: WorkItemTypeFieldWithReferences[] = yield call(fetchWorkItemTypeFields, workItemTypeName);
            yield put(WorkItemTypeFieldActions.loadSucceeded(workItemTypeName, data));
        } catch (error) {
            yield put(WorkItemTypeFieldActions.loadFailed(workItemTypeName, error.message || error));
        }
    }
}
