import { LoadStatus } from "Common/Contracts";

export interface ITagAwareState {
    tagState: ITagState;
}

export interface ITagState {
    tags?: string[];
    status: LoadStatus;
    error?: string;
}

export const defaultState: ITagState = {
    status: LoadStatus.NotLoaded
};
