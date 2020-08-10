import { LoadStatus } from "Common/Contracts";
import { RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";

import { TagActions, TagActionTypes } from "./Actions";
import { fetchTags } from "./DataSource";
import { getTagsStatus } from "./Selectors";

function* loadTags(): SagaIterator {
    const status: RT<typeof getTagsStatus> = yield select(getTagsStatus);
    if (status === LoadStatus.NotLoaded) {
        yield put(TagActions.beginLoad());
        try {
            const data: RT<typeof fetchTags> = yield call(fetchTags);
            yield put(TagActions.loadSucceeded(data));
        } catch (error) {
            yield put(TagActions.loadFailed(error.message || error));
        }
    }
}

export function* tagsSaga(): SagaIterator {
    yield takeLeading(TagActionTypes.LoadRequested, loadTags);
}
