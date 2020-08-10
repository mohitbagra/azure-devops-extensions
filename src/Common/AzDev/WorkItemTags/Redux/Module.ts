import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { TagActions } from "./Actions";
import { ITagAwareState } from "./Contracts";
import { tagReducer } from "./Reducers";
import { tagsSaga } from "./Sagas";

export function getTagModule(): ISagaModule<ITagAwareState> {
    const reducerMap: ReducersMapObject<ITagAwareState, TagActions> = {
        tagState: tagReducer
    };

    return {
        id: "tags",
        reducerMap,
        sagas: [tagsSaga]
    };
}
