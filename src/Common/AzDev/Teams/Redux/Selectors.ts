import { WebApiTeam } from "azure-devops-extension-api/Core";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { ITeamAwareState, ITeamState } from "./Contracts";

export function getTeamState(state: ITeamAwareState): ITeamState | undefined {
    return state.teamState;
}

export const getTeamsMap = createSelector(
    getTeamState,
    (state: ITeamState | undefined) => state && state.teamsMap
);

export const getTeams = createSelector(
    getTeamState,
    (state: ITeamState | undefined) => state && state.teams
);

export const getTeamsStatus = createSelector(
    getTeamState,
    (state: ITeamState | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getTeamsError = createSelector(
    getTeamState,
    (state: ITeamState | undefined) => state && state.error
);

export function getTeam(state: ITeamAwareState, teamIdOrName: string): WebApiTeam | undefined {
    const teamsMap = getTeamsMap(state);
    return teamsMap && teamsMap[teamIdOrName.toLowerCase()];
}
