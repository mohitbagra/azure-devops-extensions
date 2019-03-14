export interface ITagAwareState {
    tagState: ITagState;
}

export interface ITagState {
    tags?: string[];
    loading: boolean;
    error?: string;
}

export const defaultState: ITagState = {
    loading: false
};
