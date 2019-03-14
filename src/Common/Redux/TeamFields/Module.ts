import { TeamFieldActions } from "Common/Redux/TeamFields/Actions";
import { ITeamFieldAwareState } from "Common/Redux/TeamFields/Contracts";
import { teamFieldReducer } from "Common/Redux/TeamFields/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
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
