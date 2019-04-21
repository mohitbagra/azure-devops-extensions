import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { WorkItemChecklistActions, WorkItemChecklistActionTypes } from "./Actions";

export function* workItemChecklistSaga(): SagaIterator {
    yield takeLeading(WorkItemChecklistActionTypes.WorkItemChecklistLoadRequested, loadWorkItemChecklist);
}

function* loadWorkItemChecklist(
    action: ActionsOfType<WorkItemChecklistActions, WorkItemChecklistActionTypes.WorkItemChecklistLoadRequested>
): SagaIterator {
    const workItemId = action.payload;
}
