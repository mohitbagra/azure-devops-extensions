import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { ActionsUnion, createAction } from "Common/Redux";

import { ISettings, ISortState } from "../Interfaces";
import { IActiveWorkItemState } from "./Contracts";

export const enum RelatedWorkItemActionTypes {
    LoadRequested = "RelatedWorkItem/LoadRequested",
    BeginLoad = "RelatedWorkItem/BeginLoad",
    LoadSucceeded = "RelatedWorkItem/LoadSucceeded",
    LoadFailed = "RelatedWorkItem/LoadFailed",
    ApplyFilter = "RelatedWorkItem/ApplyFilter",
    ApplySort = "RelatedWorkItem/ApplySort",
    OpenRelatedWorkItem = "RelatedWorkItem/OpenRelatedWorkItem",
    UpdateRelatedWorkItem = "RelatedWorkItem/UpdateRelatedWorkItem"
}

export const enum RelatedWorkItemSettingsActionTypes {
    BeginLoad = "RelatedWorkItemSettings/BeginLoad",
    LoadSucceeded = "RelatedWorkItemSettings/LoadSucceeded",
    OpenPanel = "RelatedWorkItemSettings/OpenPanel",
    ClosePanel = "RelatedWorkItemSettings/ClosePanel",
    UpdateSettingsRequested = "RelatedWorkItemSettings/UpdateSettingsRequested",
    UpdateSettings = "RelatedWorkItemSettings/UpdateSettings"
}

export const RelatedWorkItemActions = {
    loadRequested: (workItemId: number) => createAction(RelatedWorkItemActionTypes.LoadRequested, workItemId),
    beginLoad: (workItemId: number) => createAction(RelatedWorkItemActionTypes.BeginLoad, workItemId),
    loadSucceeded: (workItemId: number, workItems: WorkItem[]) => createAction(RelatedWorkItemActionTypes.LoadSucceeded, { workItemId, workItems }),
    loadFailed: (workItemId: number, error: string) => createAction(RelatedWorkItemActionTypes.LoadFailed, { workItemId, error }),
    applyFilter: (filterState: IFilterState) => createAction(RelatedWorkItemActionTypes.ApplyFilter, filterState),
    applySort: (sortState: ISortState) => createAction(RelatedWorkItemActionTypes.ApplySort, sortState),
    openRelatedWorkItem: (workItemId: number) => createAction(RelatedWorkItemActionTypes.OpenRelatedWorkItem, workItemId),
    updateRelatedWorkItem: (workItem: WorkItem) => createAction(RelatedWorkItemActionTypes.UpdateRelatedWorkItem, workItem)
};

export const RelatedWorkItemSettingsActions = {
    beginLoad: () => createAction(RelatedWorkItemSettingsActionTypes.BeginLoad),
    loadSucceeded: (settings: ISettings) => createAction(RelatedWorkItemSettingsActionTypes.LoadSucceeded, settings),
    openPanel: () => createAction(RelatedWorkItemSettingsActionTypes.OpenPanel),
    closePanel: () => createAction(RelatedWorkItemSettingsActionTypes.ClosePanel),
    updateSettings: (settings: ISettings) => createAction(RelatedWorkItemSettingsActionTypes.UpdateSettings, settings)
};

export const ActiveWorkItemActions = {
    setActiveWorkItem: (activeWorkItem: IActiveWorkItemState) => createAction(ActiveWorkItemActionTypes.SetActiveWorkItem, activeWorkItem)
};

export const enum ActiveWorkItemActionTypes {
    SetActiveWorkItem = "ActiveWorkItem/SetActiveWorkItem"
}

export type ActiveWorkItemActions = ActionsUnion<typeof ActiveWorkItemActions>;
export type RelatedWorkItemActions = ActionsUnion<typeof RelatedWorkItemActions>;
export type RelatedWorkItemSettingsActions = ActionsUnion<typeof RelatedWorkItemSettingsActions>;
