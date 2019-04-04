import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";
import { GitRepoActions } from "../Redux/Actions";
import { IGitRepoAwareState, IGitRepoState } from "../Redux/Contracts";
import { getGitRepos, getGitReposError, getGitReposMap, getGitReposStatus } from "../Redux/Selectors";

export function useGitRepos(): IGitRepoState {
    const { gitRepos, gitReposMap, status, error } = useMappedState(mapState);
    const { loadRepos } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadRepos();
        }
    }, []);

    return { gitRepos, gitReposMap, status, error };
}

function mapState(state: IGitRepoAwareState): IGitRepoState {
    return {
        gitRepos: getGitRepos(state),
        gitReposMap: getGitReposMap(state),
        status: getGitReposStatus(state),
        error: getGitReposError(state)
    };
}

const Actions = {
    loadRepos: GitRepoActions.loadRequested
};
