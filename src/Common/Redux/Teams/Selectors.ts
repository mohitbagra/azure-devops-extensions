import { WebApiTeam } from "azure-devops-extension-api/Core";
import { ITeamAwareState, ITeamState } from "Common/Redux/Teams/Contracts";
import { createSelector } from "reselect";

export function getTeamState(state: ITeamAwareState): ITeamState | undefined {
    return state.teamState;
}

export const getTeamsMap = createSelector(
    getTeamState,
    (state: ITeamState | undefined) => state && state.teamsMap
);

export function getTeam(state: ITeamAwareState, teamIdOrName: string): WebApiTeam | undefined {
    const teamsMap = getTeamsMap(state);
    return teamsMap && teamsMap[teamIdOrName.toLowerCase()];
}

export const getTeams = createSelector(
    getTeamState,
    (state: ITeamState | undefined) => state && state.teams
);

export const areTeamsLoading = createSelector(
    getTeamState,
    (state: ITeamState | undefined) => !!(state && state.loading)
);
