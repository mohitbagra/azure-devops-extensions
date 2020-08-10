import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { GitRepoActions } from "./Actions";
import { IGitRepoAwareState } from "./Contracts";
import { gitRepoReducer } from "./Reducers";
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
