import { IKeyValurPairAwareState, IKeyValurPairState } from "Common/Redux/KeyValuePair/Contracts";

export function getKeyValurPairState(state: IKeyValurPairAwareState): IKeyValurPairState | undefined {
    return state.keyValurPairState;
}

export function getKeyValue<T>(state: IKeyValurPairAwareState, key: string): T | undefined {
    const keyValuePairState = getKeyValurPairState(state);
    return (keyValuePairState && keyValuePairState.keyValuePair && keyValuePairState.keyValuePair[key.toLowerCase()]) as T | undefined;
}
