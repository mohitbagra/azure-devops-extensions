import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { TeamActions, TeamActionTypes } from "./Actions";
import { defaultState, ITeamState } from "./Contracts";

export function teamReducer(state: ITeamState | undefined, action: TeamActions): ITeamState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case TeamActionTypes.BeginLoad: {
                draft.status = LoadStatus.Loading;
                draft.teams = undefined;
                draft.teamsMap = undefined;
                draft.error = undefined;
                break;
            }

            case TeamActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.teams = undefined;
                draft.teamsMap = undefined;
                draft.status = LoadStatus.LoadFailed;
                break;
            }

            case TeamActionTypes.LoadSucceeded: {
                const teams = action.payload;
                draft.teams = teams;
                draft.teamsMap = {};
                for (const team of teams) {
                    draft.teamsMap[team.id.toLowerCase()] = team;
                    draft.teamsMap[team.name.toLowerCase()] = team;
                }
                draft.status = LoadStatus.Ready;
                draft.error = undefined;
            }
        }
    });
}
