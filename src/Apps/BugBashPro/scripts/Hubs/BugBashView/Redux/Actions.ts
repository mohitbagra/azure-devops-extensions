import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { IBugBashItem, ISortState } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";
import { BugBashItemsFilterData, BugBashViewMode } from "./Contracts";

export const BugBashViewActions = {
    initialize: (bugBashId: string, initialBugBashItemId: string | undefined) =>
        createAction(BugBashViewActionTypes.Initialize, { bugBashId, initialBugBashItemId }),
    setFilteredItems: (filteredBugBashItems: IBugBashItem[] | undefined) =>
        createAction(BugBashViewActionTypes.SetFilteredItems, filteredBugBashItems),
    setFilterData: (filterData: BugBashItemsFilterData) => createAction(BugBashViewActionTypes.SetFilterData, filterData),
    setViewMode: (viewMode: BugBashViewMode) => createAction(BugBashViewActionTypes.SetViewMode, viewMode),
    applyFilter: (filterState: IFilterState) => createAction(BugBashViewActionTypes.ApplyFilter, filterState),
    applySort: (sortState: ISortState) => createAction(BugBashViewActionTypes.ApplySort, sortState),
    clearSortAndFilter: () => createAction(BugBashViewActionTypes.ClearSortAndFilter),

    editBugBashItemRequested: (bugBashId: string, bugBashItemId: string) =>
        createAction(BugBashViewActionTypes.EditBugBashItemRequested, { bugBashId, bugBashItemId })
};

export const enum BugBashViewActionTypes {
    Initialize = "BugBashView/Initialize",
    SetFilteredItems = "BugBashView/SetFilteredItems",
    SetFilterData = "BugBashView/SetFilterData",
    SetViewMode = "BugBashView/SetViewMode",
    ApplyFilter = "BugBashView/ApplyFilter",
    ApplySort = "BugBashView/ApplySort",
    ClearSortAndFilter = "BugBashView/ClearSortAndFilter",
    EditBugBashItemRequested = "BugBashView/EditBugBashItemRequested"
}

export type BugBashViewActions = ActionsUnion<typeof BugBashViewActions>;
