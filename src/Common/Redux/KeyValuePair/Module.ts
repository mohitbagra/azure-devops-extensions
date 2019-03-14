import { KeyValurPairActions } from "Common/Redux/KeyValuePair/Actions";
import { IKeyValurPairAwareState } from "Common/Redux/KeyValuePair/Contracts";
import { keyValurPairReducer } from "Common/Redux/KeyValuePair/Reducers";
import { ReducersMapObject } from "redux";
import { IModule } from "redux-dynamic-modules";

export function getKeyValurPairModule(): IModule<IKeyValurPairAwareState> {
    const reducerMap: ReducersMapObject<IKeyValurPairAwareState, KeyValurPairActions> = {
        keyValurPairState: keyValurPairReducer
    };

    return {
        id: "keyValuePair",
        reducerMap
    };
}
