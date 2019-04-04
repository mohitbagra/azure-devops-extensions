import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { LoadStatus } from "Common/Contracts";

export interface ITeamAwareState {
    teamState: ITeamState;
}

export interface ITeamState {
    teams?: WebApiTeam[];
    teamsMap?: { [idOrName: string]: WebApiTeam };
    status: LoadStatus;
    error?: string;
}

export const defaultState: ITeamState = {
    status: LoadStatus.NotLoaded
};
