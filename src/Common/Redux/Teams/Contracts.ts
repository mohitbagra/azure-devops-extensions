import { WebApiTeam } from "azure-devops-extension-api/Core";

export interface ITeamAwareState {
    teamState: ITeamState;
}

export interface ITeamState {
    teams?: WebApiTeam[];
    teamsMap?: { [idOrName: string]: WebApiTeam };
    loading: boolean;
    error?: string;
}

export const defaultState: ITeamState = {
    loading: false
};
