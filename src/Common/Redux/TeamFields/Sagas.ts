import { TeamFieldValues } from "azure-devops-extension-api/Work";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { ActionsOfType } from "../Helpers";
import { TeamFieldActions, TeamFieldActionTypes } from "./Actions";
import { ITeamFieldValues } from "./Contracts";
import { fetchTeamFieldValues } from "./DataSource";
import { getTeamFieldValues } from "./Selectors";

export function* teamFieldsSaga(): SagaIterator {
    yield takeEvery(TeamFieldActionTypes.LoadRequested, loadTeamFields);
}

function* loadTeamFields(action: ActionsOfType<TeamFieldActions, TeamFieldActionTypes.LoadRequested>): SagaIterator {
    const teamId = action.payload;
    const teamFieldValues: ITeamFieldValues | undefined = yield select(getTeamFieldValues, teamId);
    if (!teamFieldValues) {
        yield put(TeamFieldActions.beginLoad(teamId));
        try {
            const data: TeamFieldValues = yield call(fetchTeamFieldValues, teamId);
            yield put(TeamFieldActions.loadSucceeded(teamId, data));
        } catch (error) {
            yield put(TeamFieldActions.loadFailed(teamId, error.message || error));
        }
    }
}
