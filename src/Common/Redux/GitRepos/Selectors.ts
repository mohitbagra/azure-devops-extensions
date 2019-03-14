import { GitRepository } from "azure-devops-extension-api/Git";
import { IGitRepoAwareState, IGitRepoState } from "Common/Redux/GitRepos/Contracts";
import { createSelector } from "reselect";

export function getGitRepoState(state: IGitRepoAwareState): IGitRepoState | undefined {
    return state.gitRepoState;
}

export function getGitRepo(state: IGitRepoAwareState, idOrName: string): GitRepository | undefined {
    const gitRepoState = getGitRepoState(state);
    return gitRepoState && gitRepoState.gitReposMap && gitRepoState.gitReposMap[idOrName.toLowerCase()];
}

export const getGitRepos = createSelector(
    getGitRepoState,
    (state: IGitRepoState | undefined) => state && state.gitRepos
);

export const areGitReposLoading = createSelector(
    getGitRepoState,
    (state: IGitRepoState | undefined) => !!(state && state.loading)
);
