import { KeyValurPairActions, KeyValurPairActionTypes } from "Common/Redux/KeyValuePair/Actions";
import { defaultState, IKeyValurPairState } from "Common/Redux/KeyValuePair/Contracts";
import { produce } from "immer";

export function keyValurPairReducer(state: IKeyValurPairState | undefined, action: KeyValurPairActions): IKeyValurPairState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case KeyValurPairActionTypes.PushEntry: {
                const { key, value } = action.payload;
                draft.keyValuePair[key.toLowerCase()] = value;
                break;
            }

            case KeyValurPairActionTypes.DismissEntry: {
                const key = action.payload;
                delete draft.keyValuePair[key.toLowerCase()];
            }
        }
    });
}
