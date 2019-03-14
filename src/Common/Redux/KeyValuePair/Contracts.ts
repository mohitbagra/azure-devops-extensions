export interface IKeyValurPairAwareState {
    keyValurPairState: IKeyValurPairState;
}

export interface IKeyValurPairState {
    keyValuePair: { [key: string]: any };
}

export const defaultState: IKeyValurPairState = {
    keyValuePair: {}
};
