import { IKeyValuePairAwareState, IKeyValuePairState } from "./Contracts";

export function getKeyValuePairState(state: IKeyValuePairAwareState): IKeyValuePairState | undefined {
    return state.keyValuePairState;
}

export function getKeyValue<T>(state: IKeyValuePairAwareState, key: string): T | undefined {
    const keyValuePairState = getKeyValuePairState(state);
    return (keyValuePairState && keyValuePairState.keyValuePair && keyValuePairState.keyValuePair[key.toLowerCase()]) as T | undefined;
}
