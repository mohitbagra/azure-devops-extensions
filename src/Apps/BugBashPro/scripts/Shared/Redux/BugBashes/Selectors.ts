import { LoadStatus } from "Common/Contracts";
import { resolveNullableMapKey } from "Common/Utilities/String";
import { createSelector } from "reselect";
import { IBugBashesAwareState, IBugBashesState, IBugBashStateModel } from "./Contracts";

export function getBugBashesState(state: IBugBashesAwareState): IBugBashesState | undefined {
    return state.bugBashesState;
}

export function getBugBashStateModel(state: IBugBashesAwareState, bugBashId: string): IBugBashStateModel | undefined {
    const bugBashesState = getBugBashesState(state);
    return bugBashesState && bugBashesState.bugBashMap && bugBashesState.bugBashMap[resolveNullableMapKey(bugBashId)];
}

export const getAllBugBashes = createSelector(
    getBugBashesState,
    state => state && state.bugBashes
);

export const getBugBashesStatus = createSelector(
    getBugBashesState,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getBugBash = createSelector(
    getBugBashStateModel,
    bugBashStateModel => {
        return bugBashStateModel && bugBashStateModel.bugBash;
    }
);

export const getBugBashStatus = createSelector(
    getBugBashStateModel,
    bugBashStateModel => {
        return (bugBashStateModel && bugBashStateModel.status) || LoadStatus.NotLoaded;
    }
);

export const getBugBashError = createSelector(
    getBugBashStateModel,
    bugBashStateModel => {
        return bugBashStateModel && bugBashStateModel.error;
    }
);
