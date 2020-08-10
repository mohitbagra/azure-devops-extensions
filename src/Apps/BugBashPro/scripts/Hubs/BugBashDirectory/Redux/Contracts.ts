import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { IBugBash, ISortState } from "BugBashPro/Shared/Contracts";

export interface IBugBashDirectoryAwareState {
    bugBashDirectoryState: IBugBashDirectoryState;
}

export interface IBugBashDirectoryState {
    selectedTabId: BugBashDirectoryTabId;
    filteredBugBashes?: IBugBash[];
    bugBashCounts?: IBugBashCounts;
    filterState?: IFilterState;
    sortState?: ISortState;
}

export interface IBugBashCounts {
    past: number;
    ongoing: number;
    upcoming: number;
}

export const enum BugBashDirectoryTabId {
    Ongoing = "ongoing",
    Upcoming = "upcoming",
    Past = "past"
}

export const defaultBugBashDirectoryState: IBugBashDirectoryState = {
    selectedTabId: BugBashDirectoryTabId.Ongoing
};
