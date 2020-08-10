import { createSelector } from "reselect";

import { BugBashViewMode, IBugBashViewAwareState, IBugBashViewState } from "./Contracts";

export function getBugBashViewState(state: IBugBashViewAwareState): IBugBashViewState | undefined {
    return state.bugBashViewState;
}

export const getFilteredBugBashItems = createSelector(getBugBashViewState, (state) => state && state.filteredBugBashItems);

export const getBugBashItemsFilterState = createSelector(getBugBashViewState, (state) => state && state.filterState);

export const getBugBashViewFilterData = createSelector(getBugBashViewState, (state) => state && state.bugBashItemsFilterData);

export const getBugBashViewMode = createSelector(getBugBashViewState, (state) => (state && state.viewMode) || BugBashViewMode.All);

export const getBugBashItemsSortState = createSelector(getBugBashViewState, (state) => state && state.sortState);

export const getBugBashItemsSortColumn = createSelector(getBugBashItemsSortState, (state) => state && state.sortKey);

export const areBugBashItemsSortedDescending = createSelector(getBugBashItemsSortState, (state) => state && state.isSortedDescending);
