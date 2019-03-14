import { TeamFieldValues } from "azure-devops-extension-api/Work";

export interface ITeamFieldAwareState {
    teamFieldState: ITeamFieldState;
}

export interface ITeamFieldState {
    teamFieldsMap: { [teamId: string]: ITeamFieldValues };
}

export interface ITeamFieldValues extends TeamFieldValues {
    teamId: string;
    loading: boolean;
    error?: string;
}

export const defaultState: ITeamFieldState = {
    teamFieldsMap: {}
};
