import { ITagAwareState, ITagState } from "Common/Redux/Tags/Contracts";
import { createSelector } from "reselect";

export function getTagState(state: ITagAwareState): ITagState | undefined {
    return state.tagState;
}

export const getTags = createSelector(
    getTagState,
    (state: ITagState | undefined) => state && state.tags
);

export const areTagsLoading = createSelector(
    getTagState,
    (state: ITagState | undefined) => !!(state && state.loading)
);
