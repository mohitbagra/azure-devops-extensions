import { LoadStatus } from "Common/Contracts";
import {
    getGitRepos,
    getGitReposError,
    getGitReposMap,
    getGitReposStatus,
    GitRepoActions,
    IGitRepoAwareState,
    IGitRepoState
} from "Common/Redux/GitRepos";
import { useEffect } from "react";
import { useActionCreators, useMappedState } from "../../Redux";

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
