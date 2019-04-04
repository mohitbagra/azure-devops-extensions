import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { LoadStatus } from "Common/Contracts";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { GitRepoActions, GitRepoActionTypes } from "./Actions";
import { fetchGitRepos } from "./DataSource";
import { getGitReposStatus } from "./Selectors";

export function* gitReposSaga(): SagaIterator {
    yield takeEvery(GitRepoActionTypes.LoadRequested, loadGitRepos);
}

function* loadGitRepos(): SagaIterator {
    const status: LoadStatus = yield select(getGitReposStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(GitRepoActions.beginLoad());
        try {
            const data: GitRepository[] = yield call(fetchGitRepos);
            yield put(GitRepoActions.loadSucceeded(data));
        } catch (error) {
            yield put(GitRepoActions.loadFailed(error.message || error));
        }
    }
}
