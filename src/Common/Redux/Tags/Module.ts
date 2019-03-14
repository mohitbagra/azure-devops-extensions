import { TagActions } from "Common/Redux/Tags/Actions";
import { ITagAwareState } from "Common/Redux/Tags/Contracts";
import { tagReducer } from "Common/Redux/Tags/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
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
