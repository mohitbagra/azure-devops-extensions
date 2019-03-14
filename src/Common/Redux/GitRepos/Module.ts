import { GitRepoActions } from "Common/Redux/GitRepos/Actions";
import { IGitRepoAwareState } from "Common/Redux/GitRepos/Contracts";
import { gitRepoReducer } from "Common/Redux/GitRepos/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { gitReposSaga } from "./Sagas";

export function getGitRepoModule(): ISagaModule<IGitRepoAwareState> {
    const reducerMap: ReducersMapObject<IGitRepoAwareState, GitRepoActions> = {
        gitRepoState: gitRepoReducer
    };

    return {
        id: "gitRepos",
        reducerMap,
        sagas: [gitReposSaga]
    };
}
