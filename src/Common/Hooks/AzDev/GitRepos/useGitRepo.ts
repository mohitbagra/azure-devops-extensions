import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { LoadStatus } from "Common/Contracts";
import { getGitRepo, getGitReposStatus, GitRepoActions, IGitRepoAwareState } from "Common/Redux/GitRepos";
import { useCallback, useEffect } from "react";
import { useActionCreators, useMappedState } from "../../Redux";

export function useGitRepo(repoIdOrName: string): { gitRepo: GitRepository | undefined; status: LoadStatus } {
    const mapState = useCallback(
        (state: IGitRepoAwareState) => {
            return {
                gitRepo: getGitRepo(state, repoIdOrName),
                status: getGitReposStatus(state)
            };
        },
        [repoIdOrName]
    );
    const { gitRepo, status } = useMappedState(mapState);
    const { loadRepos } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadRepos();
        }
    }, []);

    return { gitRepo, status };
}

const Actions = {
    loadRepos: GitRepoActions.loadRequested
};
