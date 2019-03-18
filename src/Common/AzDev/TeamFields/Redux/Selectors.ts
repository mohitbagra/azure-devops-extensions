import { ITeamFieldAwareState, ITeamFieldState, ITeamFieldValues } from "./Contracts";

export function getTeamFieldState(state: ITeamFieldAwareState): ITeamFieldState | undefined {
    return state.teamFieldState;
}

export function getTeamFieldValues(state: ITeamFieldAwareState, teamId: string): ITeamFieldValues | undefined {
    const teamFieldState = getTeamFieldState(state);
    return teamFieldState && teamFieldState.teamFieldsMap && teamFieldState.teamFieldsMap[teamId.toLowerCase()];
}
