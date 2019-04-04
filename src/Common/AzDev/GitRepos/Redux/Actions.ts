import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { ActionsUnion, createAction } from "Common/Redux";

export const GitRepoActions = {
    loadRequested: () => createAction(GitRepoActionTypes.LoadRequested),
    beginLoad: () => createAction(GitRepoActionTypes.BeginLoad),
    loadSucceeded: (gitRepos: GitRepository[]) => createAction(GitRepoActionTypes.LoadSucceeded, gitRepos),
    loadFailed: (error: string) => createAction(GitRepoActionTypes.LoadFailed, error)
};

export const enum GitRepoActionTypes {
    LoadRequested = "GitRepos/LoadRequested",
    BeginLoad = "GitRepos/BeginLoad",
    LoadSucceeded = "GitRepos/LoadSucceeded",
    LoadFailed = "GitRepos/LoadFailed"
}

export type GitRepoActions = ActionsUnion<typeof GitRepoActions>;
