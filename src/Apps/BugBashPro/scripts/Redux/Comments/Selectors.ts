import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { ICommentsAwareState, ICommentsState, ICommentsStateModel } from "./Contracts";

export function getCommentsState(state: ICommentsAwareState): ICommentsState | undefined {
    return state.commentsState;
}

export function getCommentsStateModel(state: ICommentsAwareState, bugBashItemId: string): ICommentsStateModel | undefined {
    const commentsState = getCommentsState(state);
    return commentsState && commentsState.commentsMap && commentsState.commentsMap[resolveNullableMapKey(bugBashItemId)];
}

export const getComments = createSelector(
    getCommentsStateModel,
    state => state && state.comments
);

export const getCommentsStatus = createSelector(
    getCommentsStateModel,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getCommentsError = createSelector(
    getCommentsStateModel,
    state => state && state.error
);
