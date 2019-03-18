import { GitRepository } from "azure-devops-extension-api/Git";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { IGitRepoAwareState, IGitRepoState } from "./Contracts";

export function getGitRepoState(state: IGitRepoAwareState): IGitRepoState | undefined {
    return state.gitRepoState;
}

export const getGitRepos = createSelector(
    getGitRepoState,
    (state: IGitRepoState | undefined) => state && state.gitRepos
);

export const getGitReposMap = createSelector(
    getGitRepoState,
    (state: IGitRepoState | undefined) => state && state.gitReposMap
);

export const getGitReposStatus = createSelector(
    getGitRepoState,
    (state: IGitRepoState | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getGitReposError = createSelector(
    getGitRepoState,
    (state: IGitRepoState | undefined) => state && state.error
);

export function getGitRepo(state: IGitRepoAwareState, idOrName: string): GitRepository | undefined {
    const gitReposMap = getGitReposMap(state);
    return gitReposMap && gitReposMap[idOrName.toLowerCase()];
}
