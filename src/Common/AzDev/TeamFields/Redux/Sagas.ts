import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";

import { TeamFieldActions, TeamFieldActionTypes } from "./Actions";
import { fetchTeamFieldValues } from "./DataSource";
import { getTeamFieldValuesStatus } from "./Selectors";

function* loadTeamFields(action: ActionsOfType<TeamFieldActions, TeamFieldActionTypes.LoadRequested>): SagaIterator {
    const teamId = action.payload;
    const status: RT<typeof getTeamFieldValuesStatus> = yield select(getTeamFieldValuesStatus, teamId);
    if (status === LoadStatus.NotLoaded) {
        yield put(TeamFieldActions.beginLoad(teamId));
        try {
            const data: RT<typeof fetchTeamFieldValues> = yield call(fetchTeamFieldValues, teamId);
            yield put(TeamFieldActions.loadSucceeded(teamId, data));
        } catch (error) {
            yield put(TeamFieldActions.loadFailed(teamId, error.message || error));
        }
    }
}

export function* teamFieldsSaga(): SagaIterator {
    yield takeEvery(TeamFieldActionTypes.LoadRequested, loadTeamFields);
}
