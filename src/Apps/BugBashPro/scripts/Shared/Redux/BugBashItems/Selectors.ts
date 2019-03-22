import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { IBugBashItemsAwareState, IBugBashItemsState, IBugBashItemStateModel } from "./Contracts";

export function getBugBashItemsState(state: IBugBashItemsAwareState): IBugBashItemsState | undefined {
    return state.bugBashItemsState;
}

export function getBugBashItemStateModel(state: IBugBashItemsAwareState, bugBashItemId: string): IBugBashItemStateModel | undefined {
    const bugBashItemsState = getBugBashItemsState(state);
    return bugBashItemsState && bugBashItemsState.bugBashItemMap && bugBashItemsState.bugBashItemMap[resolveNullableMapKey(bugBashItemId)];
}

export function getResolvedWorkItem(state: IBugBashItemsAwareState, id: number): WorkItem | undefined {
    const bugBashItemState = getBugBashItemsState(state);
    return bugBashItemState && bugBashItemState.resolvedWorkItemsMap && bugBashItemState.resolvedWorkItemsMap[id];
}

export const getAllBugBashItems = createSelector(
    getBugBashItemsState,
    state => state && state.bugBashItems
);

export const getResolvedWorkItemsMap = createSelector(
    getBugBashItemsState,
    state => state && state.resolvedWorkItemsMap
);

export const getBugBashItemsStatus = createSelector(
    getBugBashItemsState,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getBugBashItem = createSelector(
    getBugBashItemStateModel,
    bugBashItemStateModel => {
        return bugBashItemStateModel && bugBashItemStateModel.bugBashItem;
    }
);

export const getBugBashItemError = createSelector(
    getBugBashItemStateModel,
    bugBashItemStateModel => {
        return bugBashItemStateModel && bugBashItemStateModel.error;
    }
);

export const getBugBashItemStatus = createSelector(
    getBugBashItemStateModel,
    state => (state && state.status) || LoadStatus.NotLoaded
);
