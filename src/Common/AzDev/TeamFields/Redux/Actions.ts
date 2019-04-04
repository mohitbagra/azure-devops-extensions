import { TeamFieldValues } from "azure-devops-extension-api/Work/Work";
import { ActionsUnion, createAction } from "Common/Redux";

export const TeamFieldActions = {
    loadRequested: (teamId: string) => createAction(TeamFieldActionTypes.LoadRequested, teamId),
    beginLoad: (teamId: string) => createAction(TeamFieldActionTypes.BeginLoad, teamId),
    loadSucceeded: (teamId: string, teamFieldValues: TeamFieldValues) =>
        createAction(TeamFieldActionTypes.LoadSucceeded, { teamId, teamFieldValues }),
    loadFailed: (teamId: string, error: string) => createAction(TeamFieldActionTypes.LoadFailed, { teamId, error })
};

export const enum TeamFieldActionTypes {
    LoadRequested = "TeamFields/LoadRequested",
    BeginLoad = "TeamFields/BeginLoad",
    LoadSucceeded = "TeamFields/LoadSucceeded",
    LoadFailed = "TeamFields/LoadFailed"
}

export type TeamFieldActions = ActionsUnion<typeof TeamFieldActions>;
