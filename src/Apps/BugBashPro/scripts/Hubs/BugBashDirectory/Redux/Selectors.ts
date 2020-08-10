import { createSelector } from "reselect";

import { BugBashDirectoryTabId, IBugBashDirectoryAwareState, IBugBashDirectoryState } from "./Contracts";

export function getBugBashDirectoryState(state: IBugBashDirectoryAwareState): IBugBashDirectoryState | undefined {
    return state.bugBashDirectoryState;
}

export const getBugBashDirectorySelectedTab = createSelector(
    getBugBashDirectoryState,
    (state) => (state && state.selectedTabId) || BugBashDirectoryTabId.Ongoing
);

export const getFilteredBugBashes = createSelector(getBugBashDirectoryState, (state) => state && state.filteredBugBashes);

export const getBugBashCounts = createSelector(getBugBashDirectoryState, (state) => state && state.bugBashCounts);

export const getBugBashesFilterState = createSelector(getBugBashDirectoryState, (state) => state && state.filterState);

export const getBugBashesSortState = createSelector(getBugBashDirectoryState, (state) => state && state.sortState);

export const getBugBashesSortColumn = createSelector(getBugBashesSortState, (state) => state && state.sortKey);

export const areBugBashesSortedDescending = createSelector(getBugBashesSortState, (state) => state && state.isSortedDescending);
