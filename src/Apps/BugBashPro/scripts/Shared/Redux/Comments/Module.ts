import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { CommentActions } from "./Actions";
import { ICommentsAwareState } from "./Contracts";
import { commentsReducer } from "./Reducers";
import { commentsSaga } from "./Sagas";

export function getCommentsModule(): ISagaModule<ICommentsAwareState> {
    const reducerMap: ReducersMapObject<ICommentsAwareState, CommentActions> = {
        commentsState: commentsReducer
    };

    return {
        id: "comments",
        reducerMap,
        sagas: [commentsSaga]
    };
}
