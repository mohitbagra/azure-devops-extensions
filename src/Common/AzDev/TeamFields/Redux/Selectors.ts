import { LoadStatus } from "Common/Contracts";
import { ITeamFieldAwareState, ITeamFieldState, ITeamFieldValues } from "./Contracts";

export function getTeamFieldState(state: ITeamFieldAwareState): ITeamFieldState | undefined {
    return state.teamFieldState;
}

export function getTeamFieldValues(state: ITeamFieldAwareState, teamId: string): ITeamFieldValues | undefined {
    const teamFieldState = getTeamFieldState(state);
    return teamFieldState && teamFieldState.teamFieldsMap && teamFieldState.teamFieldsMap[teamId.toLowerCase()];
}

export function getTeamFieldValuesStatus(state: ITeamFieldAwareState, teamId: string): LoadStatus {
    const teamFieldState = getTeamFieldState(state);
    return (
        (teamFieldState &&
            teamFieldState.teamFieldsMap &&
            teamFieldState.teamFieldsMap[teamId.toLowerCase()] &&
            teamFieldState.teamFieldsMap[teamId.toLowerCase()].status) ||
        LoadStatus.NotLoaded
    );
}

export function getTeamFieldValuesError(state: ITeamFieldAwareState, teamId: string): string | undefined {
    const teamFieldState = getTeamFieldState(state);
    return (
        teamFieldState &&
        teamFieldState.teamFieldsMap &&
        teamFieldState.teamFieldsMap[teamId.toLowerCase()] &&
        teamFieldState.teamFieldsMap[teamId.toLowerCase()].error
    );
}
