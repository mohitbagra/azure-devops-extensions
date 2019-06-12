import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { ActionsUnion, createAction } from "Common/Redux";
import { ISettings, ISortState } from "../Interfaces";
import { IActiveWorkItemState } from "./Contracts";

export const RelatedWorkItemActions = {
    beginLoad: () => createAction(RelatedWorkItemActionTypes.BeginLoad),
    loadSucceeded: (workItems: WorkItem[]) => createAction(RelatedWorkItemActionTypes.LoadSucceeded, workItems),
    loadFailed: (error: string) => createAction(RelatedWorkItemActionTypes.LoadFailed, error),
    applyFilter: (filterState: IFilterState) => createAction(RelatedWorkItemActionTypes.ApplyFilter, filterState),
    applySort: (sortState: ISortState) => createAction(RelatedWorkItemActionTypes.ApplySort, sortState),
    clearSortAndFilter: () => createAction(RelatedWorkItemActionTypes.ClearSortAndFilter),
    clean: () => createAction(RelatedWorkItemActionTypes.Clean)
};

export const RelatedWorkItemSettingsActions = {
    beginLoad: () => createAction(RelatedWorkItemSettingsActionTypes.BeginLoad),
    loadSucceeded: (settings: ISettings) => createAction(RelatedWorkItemSettingsActionTypes.LoadSucceeded, settings),
    openPanel: () => createAction(RelatedWorkItemSettingsActionTypes.OpenPanel),
    closePanel: () => createAction(RelatedWorkItemSettingsActionTypes.ClosePanel),
    updateSettings: (settings: ISettings) => createAction(RelatedWorkItemSettingsActionTypes.UpdateSettings, settings)
};

export const ActiveWorkItemActions = {
    setActiveWorkItem: (activeWorkItem: IActiveWorkItemState) => createAction(ActiveWorkItemActionTypes.SetActiveWorkItem, activeWorkItem),
    workItemUnloaded: () => createAction(ActiveWorkItemActionTypes.WorkItemUnloaded)
};

export const enum RelatedWorkItemActionTypes {
    BeginLoad = "RelatedWorkItem/BeginLoad",
    LoadRequested = "RelatedWorkItem/LoadRequested",
    LoadSucceeded = "RelatedWorkItem/LoadSucceeded",
    LoadFailed = "RelatedWorkItem/LoadFailed",
    ApplyFilter = "RelatedWorkItem/ApplyFilter",
    ApplySort = "RelatedWorkItem/ApplySort",
    ClearSortAndFilter = "RelatedWorkItem/ClearSortAndFilter",
    Clean = "RelatedWorkItem/Clean"
}

export const enum RelatedWorkItemSettingsActionTypes {
    BeginLoad = "RelatedWorkItemSettings/BeginLoad",
    LoadRequested = "RelatedWorkItemSettings/LoadRequested",
    LoadSucceeded = "RelatedWorkItemSettings/LoadSucceeded",
    OpenPanel = "RelatedWorkItemSettings/OpenPanel",
    ClosePanel = "RelatedWorkItemSettings/ClosePanel",
    UpdateSettings = "RelatedWorkItemSettings/UpdateSettings",
    SaveSettings = "RelatedWorkItemSettings/SaveSettings"
}

export const enum ActiveWorkItemActionTypes {
    SetActiveWorkItem = "ActiveWorkItem/SetActiveWorkItem",
    WorkItemLoaded = "ActiveWorkItem/WorkItemLoaded",
    WorkItemUnloaded = "ActiveWorkItem/WorkItemUnloaded",
    WorkItemSaved = "ActiveWorkItem/WorkItemSaved",
    WorkItemRefreshed = "ActiveWorkItem/WorkItemRefreshed"
}

export type ActiveWorkItemActions = ActionsUnion<typeof ActiveWorkItemActions>;
export type RelatedWorkItemActions = ActionsUnion<typeof RelatedWorkItemActions>;
export type RelatedWorkItemSettingsActions = ActionsUnion<typeof RelatedWorkItemSettingsActions>;
