import { produce } from "immer";
import { KeyValuePairActions, KeyValuePairActionTypes } from "./Actions";
import { defaultState, IKeyValuePairState } from "./Contracts";

export function keyValuePairReducer(state: IKeyValuePairState | undefined, action: KeyValuePairActions): IKeyValuePairState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case KeyValuePairActionTypes.PushEntry: {
                const { key, value } = action.payload;
                draft.keyValuePair[key.toLowerCase()] = value;
                break;
            }

            case KeyValuePairActionTypes.DismissEntry: {
                const key = action.payload;
                delete draft.keyValuePair[key.toLowerCase()];
            }
        }
    });
}
