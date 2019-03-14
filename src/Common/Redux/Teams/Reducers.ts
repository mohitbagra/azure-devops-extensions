import { TeamActions, TeamActionTypes } from "Common/Redux/Teams/Actions";
import { defaultState, ITeamState } from "Common/Redux/Teams/Contracts";
import { produce } from "immer";

export function teamReducer(state: ITeamState | undefined, action: TeamActions): ITeamState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case TeamActionTypes.BeginLoad: {
                draft.loading = true;
                draft.teams = undefined;
                draft.teamsMap = undefined;
                draft.error = undefined;
                break;
            }

            case TeamActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.teams = undefined;
                draft.teamsMap = undefined;
                draft.loading = false;
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
                draft.loading = false;
                draft.error = undefined;
            }
        }
    });
}
