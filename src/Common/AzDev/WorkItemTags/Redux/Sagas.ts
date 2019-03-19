import { LoadStatus } from "Common/Contracts";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { TagActions, TagActionTypes } from "./Actions";
import { fetchTags } from "./DataSource";
import { getTagsStatus } from "./Selectors";

export function* tagsSaga(): SagaIterator {
    yield takeEvery(TagActionTypes.LoadRequested, loadTags);
}

function* loadTags(): SagaIterator {
    const status: LoadStatus = yield select(getTagsStatus);
    if (status === LoadStatus.NotLoaded) {
        yield put(TagActions.beginLoad());
        try {
            const data: string[] = yield call(fetchTags);
            yield put(TagActions.loadSucceeded(data));
        } catch (error) {
            yield put(TagActions.loadFailed(error.message || error));
        }
    }
}
