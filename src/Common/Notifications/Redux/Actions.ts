import { ActionsUnion, createAction } from "Common/Redux";

export const enum KeyValuePairActionTypes {
    PushEntry = "KeyValuePair/PushEntry",
    DismissEntry = "KeyValuePair/DismissEntry"
}

export const KeyValuePairActions = {
    pushEntry: <T extends any>(key: string, value: T) => createAction(KeyValuePairActionTypes.PushEntry, { key, value }),
    dismissEntry: (key: string) => createAction(KeyValuePairActionTypes.DismissEntry, key)
};

export type KeyValuePairActions = ActionsUnion<typeof KeyValuePairActions>;
