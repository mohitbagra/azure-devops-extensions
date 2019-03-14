import { WebApiTeam } from "azure-devops-extension-api/Core";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { TeamActions, TeamActionTypes } from "./Actions";
import { fetchTeams } from "./DataSource";
import { areTeamsLoading, getTeams } from "./Selectors";

export function* teamsSaga(): SagaIterator {
    yield takeEvery(TeamActionTypes.LoadRequested, loadTeams);
}

function* loadTeams(): SagaIterator {
    const teams: WebApiTeam[] | undefined = yield select(getTeams);
    const areLoading: boolean = yield select(areTeamsLoading);
    if (!teams && !areLoading) {
        yield put(TeamActions.beginLoad());
        try {
            const data: WebApiTeam[] = yield call(fetchTeams);
            yield put(TeamActions.loadSucceeded(data));
        } catch (error) {
            yield put(TeamActions.loadFailed(error.message || error));
        }
    }
}
