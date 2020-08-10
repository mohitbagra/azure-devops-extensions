import { WorkItem, WorkItemField, WorkItemRelation, WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { LoadStatus } from "Common/Contracts";

import { ISettings, ISortState } from "../Interfaces";

export interface IRelatedWitsAwareState {
    settingsState: ISettingsState;
    relatedWorkItemsState: IRelatedWorkItemsState;
    activeWorkItemState: IActiveWorkItemState;
}

export interface ISettingsState {
    status: LoadStatus;
    isPanelOpen?: boolean;
    settings?: ISettings;
}

export interface IRelatedWorkItemsState {
    relatedWorkItems: { [workItemId: number]: IRelatedWorkItemsStateModel };
    filterState?: IFilterState;
    sortState?: ISortState;
}

export interface IRelatedWorkItemsStateModel {
    workItemId: number;
    status: LoadStatus;
    error?: string;
    workItems?: WorkItem[];
}

export interface IActiveWorkItemState {
    links?: WorkItemRelation[];
    relationTypes?: WorkItemRelationType[];
    sortableFields?: WorkItemField[];
    queryableFields?: WorkItemField[];
}

export const defaultSettingsState: ISettingsState = {
    status: LoadStatus.NotLoaded
};

export const defaultRelatedWorkItemsState: IRelatedWorkItemsState = {
    relatedWorkItems: {}
};

export const defaultActiveWorkItemState: IActiveWorkItemState = {};
