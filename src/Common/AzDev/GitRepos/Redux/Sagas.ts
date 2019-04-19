import { LoadStatus } from "Common/Contracts";
import { RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { GitRepoActions, GitRepoActionTypes } from "./Actions";
import { fetchGitRepos } from "./DataSource";
import { getGitReposStatus } from "./Selectors";

export function* gitReposSaga(): SagaIterator {
    yield takeLeading(GitRepoActionTypes.LoadRequested, loadGitRepos);
}

function* loadGitRepos(): SagaIterator {
    const status: RT<typeof getGitReposStatus> = yield select(getGitReposStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(GitRepoActions.beginLoad());
        try {
            const data: RT<typeof fetchGitRepos> = yield call(fetchGitRepos);
            yield put(GitRepoActions.loadSucceeded(data));
        } catch (error) {
            yield put(GitRepoActions.loadFailed(error.message || error));
        }
    }
}
