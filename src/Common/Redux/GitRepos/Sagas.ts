import { GitRepository } from "azure-devops-extension-api/Git";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { GitRepoActions, GitRepoActionTypes } from "./Actions";
import { fetchGitRepos } from "./DataSource";
import { areGitReposLoading, getGitRepos } from "./Selectors";

export function* gitReposSaga(): SagaIterator {
    yield takeEvery(GitRepoActionTypes.LoadRequested, loadGitRepos);
}

function* loadGitRepos(): SagaIterator {
    const gitRepos: GitRepository[] | undefined = yield select(getGitRepos);
    const areLoading: boolean = yield select(areGitReposLoading);
    if (!gitRepos && !areLoading) {
        yield put(GitRepoActions.beginLoad());
        try {
            const data: GitRepository[] = yield call(fetchGitRepos);
            yield put(GitRepoActions.loadSucceeded(data));
        } catch (error) {
            yield put(GitRepoActions.loadFailed(error.message || error));
        }
    }
}
