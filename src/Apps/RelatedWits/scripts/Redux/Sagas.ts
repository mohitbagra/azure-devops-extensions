import { delay, takeEvery } from "redux-saga/effects";
import { RelatedWorkItemActions } from "./Actions";

export function* relatedWitsSaga() {
    yield takeEvery(RelatedWorkItemActions.beginLoad, loadRelatedWits);
}

function* loadRelatedWits() {
    yield delay(500);
}
