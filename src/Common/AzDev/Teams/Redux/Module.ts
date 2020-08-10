import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { TeamActions } from "./Actions";
import { ITeamAwareState } from "./Contracts";
import { teamReducer } from "./Reducers";
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
