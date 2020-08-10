import { LoadStatus } from "Common/Contracts";
import { RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";

import { TeamActions, TeamActionTypes } from "./Actions";
import { fetchTeams } from "./DataSource";
import { getTeamsStatus } from "./Selectors";

function* loadTeams(): SagaIterator {
    const status: RT<typeof getTeamsStatus> = yield select(getTeamsStatus);

    if (status === LoadStatus.NotLoaded) {
        yield put(TeamActions.beginLoad());
        try {
            const data: RT<typeof fetchTeams> = yield call(fetchTeams);
            yield put(TeamActions.loadSucceeded(data));
        } catch (error) {
            yield put(TeamActions.loadFailed(error.message || error));
        }
    }
}

export function* teamsSaga(): SagaIterator {
    yield takeLeading(TeamActionTypes.LoadRequested, loadTeams);
}
