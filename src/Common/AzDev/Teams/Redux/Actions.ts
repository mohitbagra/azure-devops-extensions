import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { ActionsUnion, createAction } from "Common/Redux";

export const enum TeamActionTypes {
    LoadRequested = "Teams/LoadRequested",
    BeginLoad = "Teams/BeginLoad",
    LoadSucceeded = "Teams/LoadSucceeded",
    LoadFailed = "Teams/LoadFailed"
}

export const TeamActions = {
    loadRequested: () => createAction(TeamActionTypes.LoadRequested),
    beginLoad: () => createAction(TeamActionTypes.BeginLoad),
    loadSucceeded: (teams: WebApiTeam[]) => createAction(TeamActionTypes.LoadSucceeded, teams),
    loadFailed: (error: string) => createAction(TeamActionTypes.LoadFailed, error)
};

export type TeamActions = ActionsUnion<typeof TeamActions>;
