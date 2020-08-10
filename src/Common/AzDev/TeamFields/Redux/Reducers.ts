import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";

import { TeamFieldActions, TeamFieldActionTypes } from "./Actions";
import { defaultState, ITeamFieldState, ITeamFieldValues } from "./Contracts";

export function teamFieldReducer(state: ITeamFieldState | undefined, action: TeamFieldActions): ITeamFieldState {
    return produce(state || defaultState, (draft) => {
        switch (action.type) {
            case TeamFieldActionTypes.BeginLoad: {
                const teamId = action.payload;
                draft.teamFieldsMap[teamId.toLowerCase()] = {
                    teamId: teamId,
                    status: LoadStatus.Loading
                } as ITeamFieldValues;
                break;
            }

            case TeamFieldActionTypes.LoadFailed: {
                const { teamId, error } = action.payload;
                draft.teamFieldsMap[teamId.toLowerCase()].error = error;
                draft.teamFieldsMap[teamId.toLowerCase()].status = LoadStatus.LoadFailed;
                break;
            }

            case TeamFieldActionTypes.LoadSucceeded: {
                const { teamId, teamFieldValues } = action.payload;
                draft.teamFieldsMap[teamId.toLowerCase()] = {
                    status: LoadStatus.Ready,
                    teamId: teamId,
                    ...teamFieldValues
                };
            }
        }
    });
}
