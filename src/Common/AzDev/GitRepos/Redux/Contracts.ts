import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { LoadStatus } from "Common/Contracts";

export interface IGitRepoAwareState {
    gitRepoState: IGitRepoState;
}

export interface IGitRepoState {
    gitRepos?: GitRepository[];
    gitReposMap?: { [idOrName: string]: GitRepository };
    status: LoadStatus;
    error?: string;
}

export const defaultState: IGitRepoState = {
    status: LoadStatus.NotLoaded
};
