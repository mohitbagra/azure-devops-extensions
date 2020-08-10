import { TeamFieldValues } from "azure-devops-extension-api/Work/Work";
import { LoadStatus } from "Common/Contracts";

export interface ITeamFieldAwareState {
    teamFieldState: ITeamFieldState;
}

export interface ITeamFieldState {
    teamFieldsMap: { [teamId: string]: ITeamFieldValues };
}

export interface ITeamFieldValues extends TeamFieldValues {
    teamId: string;
    status: LoadStatus;
    error?: string;
}

export const defaultState: ITeamFieldState = {
    teamFieldsMap: {}
};
