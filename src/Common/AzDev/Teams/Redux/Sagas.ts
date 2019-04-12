import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { LoadStatus } from "Common/Contracts";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { TeamActions, TeamActionTypes } from "./Actions";
import { fetchTeams } from "./DataSource";
import { getTeamsStatus } from "./Selectors";

export function* teamsSaga(): SagaIterator {
    yield takeLeading(TeamActionTypes.LoadRequested, loadTeams);
}

function* loadTeams(): SagaIterator {
    const status: LoadStatus = yield select(getTeamsStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(TeamActions.beginLoad());
        try {
            const data: WebApiTeam[] = yield call(fetchTeams);
            yield put(TeamActions.loadSucceeded(data));
        } catch (error) {
            yield put(TeamActions.loadFailed(error.message || error));
        }
    }
}
