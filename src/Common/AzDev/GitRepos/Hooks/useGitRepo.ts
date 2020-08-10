import { useCallback, useEffect } from "react";

import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { GitRepoActions } from "../Redux/Actions";
import { IGitRepoAwareState } from "../Redux/Contracts";
import { getGitRepo, getGitReposError, getGitReposStatus } from "../Redux/Selectors";

interface IUseGitRepoMappedState {
    gitRepo: GitRepository | undefined;
    status: LoadStatus;
    error: string | undefined;
}

const Actions = {
    loadRepos: GitRepoActions.loadRequested
};

export function useGitRepo(repoIdOrName: string): IUseGitRepoMappedState {
    const mapState = useCallback(
        (state: IGitRepoAwareState) => {
            return {
                gitRepo: getGitRepo(state, repoIdOrName),
                status: getGitReposStatus(state),
                error: getGitReposError(state)
            };
        },
        [repoIdOrName]
    );
    const { gitRepo, status, error } = useMappedState(mapState);
    const { loadRepos } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadRepos();
        }
    }, []);

    return { gitRepo, status, error };
}
