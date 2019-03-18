import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { GitRepoActions, GitRepoActionTypes } from "./Actions";
import { defaultState, IGitRepoState } from "./Contracts";

export function gitRepoReducer(state: IGitRepoState | undefined, action: GitRepoActions): IGitRepoState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case GitRepoActionTypes.BeginLoad: {
                draft.status = LoadStatus.Loading;
                draft.gitRepos = undefined;
                draft.gitReposMap = undefined;
                draft.error = undefined;
                break;
            }

            case GitRepoActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.gitRepos = undefined;
                draft.gitReposMap = undefined;
                draft.status = LoadStatus.LoadFailed;
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
                draft.status = LoadStatus.Ready;
                draft.error = undefined;
            }
        }
    });
}
