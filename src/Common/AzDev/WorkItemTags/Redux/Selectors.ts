import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { ITagAwareState, ITagState } from "./Contracts";

export function getTagState(state: ITagAwareState): ITagState | undefined {
    return state.tagState;
}

export const getTags = createSelector(
    getTagState,
    (state: ITagState | undefined) => state && state.tags
);

export const getTagsStatus = createSelector(
    getTagState,
    (state: ITagState | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getTagsError = createSelector(
    getTagState,
    (state: ITagState | undefined) => state && state.error
);
