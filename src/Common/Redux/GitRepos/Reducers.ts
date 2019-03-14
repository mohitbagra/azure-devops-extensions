import { GitRepoActions, GitRepoActionTypes } from "Common/Redux/GitRepos/Actions";
import { defaultState, IGitRepoState } from "Common/Redux/GitRepos/Contracts";
import { produce } from "immer";

export function gitRepoReducer(state: IGitRepoState | undefined, action: GitRepoActions): IGitRepoState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case GitRepoActionTypes.BeginLoad: {
                draft.loading = true;
                draft.gitRepos = undefined;
                draft.gitReposMap = undefined;
                draft.error = undefined;
                break;
            }

            case GitRepoActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.gitRepos = undefined;
                draft.gitReposMap = undefined;
                draft.loading = false;
                break;
            }

            case GitRepoActionTypes.LoadSucceeded: {
                const gitRepos = action.payload;
                draft.gitRepos = gitRepos;
                draft.gitReposMap = {};
                for (const gitRepo of gitRepos) {
                    draft.gitReposMap[gitRepo.id.toLowerCase()] = gitRepo;
                    draft.gitReposMap[gitRepo.name.toLowerCase()] = gitRepo;
                }
                draft.loading = false;
                draft.error = undefined;
            }
        }
    });
}
