import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const KeyValurPairActions = {
    pushEntry: <T extends any>(key: string, value: T) => createAction(KeyValurPairActionTypes.PushEntry, { key, value }),
    dismissEntry: (key: string) => createAction(KeyValurPairActionTypes.DismissEntry, key)
};

export const enum KeyValurPairActionTypes {
    PushEntry = "KeyValurPair/PushEntry",
    DismissEntry = "KeyValurPair/DismissEntry"
}

export type KeyValurPairActions = ActionsUnion<typeof KeyValurPairActions>;
