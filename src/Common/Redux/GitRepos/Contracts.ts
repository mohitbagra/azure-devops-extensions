import { GitRepository } from "azure-devops-extension-api/Git";

export interface IGitRepoAwareState {
    gitRepoState: IGitRepoState;
}

export interface IGitRepoState {
    gitRepos?: GitRepository[];
    gitReposMap?: { [idOrName: string]: GitRepository };
    loading: boolean;
    error?: string;
}

export const defaultState: IGitRepoState = {
    loading: false
};
