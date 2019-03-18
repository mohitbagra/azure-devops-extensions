export interface IKeyValuePairAwareState {
    keyValuePairState: IKeyValuePairState;
}

export interface IKeyValuePairState {
    keyValuePair: { [key: string]: any };
}

export const defaultState: IKeyValuePairState = {
    keyValuePair: {}
};
