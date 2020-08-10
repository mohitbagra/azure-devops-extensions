import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { TeamFieldActions } from "./Actions";
import { ITeamFieldAwareState } from "./Contracts";
import { teamFieldReducer } from "./Reducers";
import { teamFieldsSaga } from "./Sagas";

export function getTeamFieldModule(): ISagaModule<ITeamFieldAwareState> {
    const reducerMap: ReducersMapObject<ITeamFieldAwareState, TeamFieldActions> = {
        teamFieldState: teamFieldReducer
    };

    return {
        id: "teamFields",
        reducerMap,
        sagas: [teamFieldsSaga]
    };
}
