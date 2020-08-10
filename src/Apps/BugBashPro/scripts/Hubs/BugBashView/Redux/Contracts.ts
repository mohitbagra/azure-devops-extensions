import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { IBugBashItem, ISortState } from "BugBashPro/Shared/Contracts";

export interface IBugBashViewAwareState {
    bugBashViewState: IBugBashViewState;
}

export interface IBugBashViewState {
    viewMode: BugBashViewMode;
    filteredBugBashItems?: IBugBashItem[];
    bugBashItemsFilterData?: BugBashItemsFilterData;
    filterState?: IFilterState;
    sortState?: ISortState;
}

export const enum BugBashViewMode {
    Pending = "Pending Items",
    Rejected = "Rejected Items",
    Accepted = "Accepted Items",
    All = "All Items"
}

export const defaultBugBashViewState: IBugBashViewState = {
    viewMode: BugBashViewMode.All
};

export type BugBashItemsFilterData = { [key: string]: { [subkey: string]: number } } | undefined;
