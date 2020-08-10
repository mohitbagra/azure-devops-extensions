import { LoadStatus } from "Common/Contracts";
import { resolveNullableMapKey } from "Common/Utilities/String";
import { createSelector } from "reselect";

import { IBugBashDetailsAwareState, IBugBashDetailsState, IBugBashDetailsStateModel } from "./Contracts";

export function getBugBashDetailsState(state: IBugBashDetailsAwareState): IBugBashDetailsState | undefined {
    return state.bugBashDetailsState;
}

export function getBugBashDetailsStateModel(state: IBugBashDetailsAwareState, bugBashId: string): IBugBashDetailsStateModel | undefined {
    const detailsState = getBugBashDetailsState(state);
    return detailsState && detailsState.detailsMap && detailsState.detailsMap[resolveNullableMapKey(bugBashId)];
}

export const getBugBashDetails = createSelector(getBugBashDetailsStateModel, (state) => state && state.details);

export const getBugBashDetailsStatus = createSelector(getBugBashDetailsStateModel, (state) => (state && state.status) || LoadStatus.NotLoaded);

export const getBugBashDetailsError = createSelector(getBugBashDetailsStateModel, (state) => state && state.error);
