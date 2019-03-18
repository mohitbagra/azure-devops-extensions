import { ReducersMapObject } from "redux";
import { IModule } from "redux-dynamic-modules";
import { KeyValuePairActions } from "./Actions";
import { IKeyValuePairAwareState } from "./Contracts";
import { keyValuePairReducer } from "./Reducers";

export function getKeyValuePairModule(): IModule<IKeyValuePairAwareState> {
    const reducerMap: ReducersMapObject<IKeyValuePairAwareState, KeyValuePairActions> = {
        keyValuePairState: keyValuePairReducer
    };

    return {
        id: "keyValuePair",
        reducerMap
    };
}
