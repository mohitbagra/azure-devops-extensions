import { all, call, put, select, takeEvery, takeLeading } from "redux-saga/effects";
import { RelatedWorkItemActions } from "./Actions";

export function* checklistSaga() {
    yield takeEvery(RelatedWorkItemActions.beginLoad, loadChecklist);
}
