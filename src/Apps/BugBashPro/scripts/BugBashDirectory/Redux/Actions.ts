import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { IBugBash, ISortState } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux/Helpers";
import { BugBashDirectoryTabId, IBugBashCounts } from "./Contracts";

export const BugBashDirectoryActions = {
    initialize: () => createAction(BugBashDirectoryActionTypes.Initialize),
    setFilteredItems: (filteredBugBashes: IBugBash[] | undefined, bugBashCounts: IBugBashCounts | undefined) =>
        createAction(BugBashDirectoryActionTypes.SetFilteredItems, { filteredBugBashes, bugBashCounts }),
    selectTab: (tabId: BugBashDirectoryTabId) => createAction(BugBashDirectoryActionTypes.SelectTab, tabId),
    applyFilter: (filterState: IFilterState) => createAction(BugBashDirectoryActionTypes.ApplyFilter, filterState),
    applySort: (sortState: ISortState) => createAction(BugBashDirectoryActionTypes.ApplySort, sortState),
    clearSortAndFilter: () => createAction(BugBashDirectoryActionTypes.ClearSortAndFilter)
};

export const enum BugBashDirectoryActionTypes {
    Initialize = "BugBashDirectory/Initialize",
    SetFilteredItems = "BugBashDirectory/SetFilteredItems",
    SelectTab = "BugBashDirectory/SelectTab",
    ApplyFilter = "BugBashDirectory/ApplyFilter",
    ApplySort = "BugBashDirectory/ApplySort",
    ClearSortAndFilter = "BugBashDirectory/ClearSortAndFilter"
}

export type BugBashDirectoryActions = ActionsUnion<typeof BugBashDirectoryActions>;
