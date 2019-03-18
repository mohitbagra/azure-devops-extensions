import { ActionsUnion, createAction } from "Common/Redux";

export const KeyValuePairActions = {
    pushEntry: <T extends any>(key: string, value: T) => createAction(KeyValuePairActionTypes.PushEntry, { key, value }),
    dismissEntry: (key: string) => createAction(KeyValuePairActionTypes.DismissEntry, key)
};

export const enum KeyValuePairActionTypes {
    PushEntry = "KeyValuePair/PushEntry",
    DismissEntry = "KeyValuePair/DismissEntry"
}

export type KeyValuePairActions = ActionsUnion<typeof KeyValuePairActions>;
