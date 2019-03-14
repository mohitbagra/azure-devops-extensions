import { TeamActions } from "Common/Redux/Teams/Actions";
import { ITeamAwareState } from "Common/Redux/Teams/Contracts";
import { teamReducer } from "Common/Redux/Teams/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { teamsSaga } from "./Sagas";

export function getTeamModule(): ISagaModule<ITeamAwareState> {
    const reducerMap: ReducersMapObject<ITeamAwareState, TeamActions> = {
        teamState: teamReducer
    };

    return {
        id: "teams",
        reducerMap,
        sagas: [teamsSaga]
    };
}
