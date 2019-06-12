import { WorkItem, WorkItemField, WorkItemRelation, WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { ISortState } from "../Interfaces";

export interface IRelatedWitsAwareState {
    settingsState: ISettingsState;
    relatedWorkItemsState: IRelatedWorkItemsState;
    activeWorkItemState: IActiveWorkItemState;
}

export interface ISettingsState {
    loading: boolean;
    isPanelOpen?: boolean;
    settings?: IChangeableSettings;
}

export interface IRelatedWorkItemsState {
    loading: boolean;
    error?: string;
    workItems?: WorkItem[];
    filteredItems?: WorkItem[];
    filterState?: IFilterState;
    sortState?: ISortState;
    propertyMap?: { [key: string]: { [key: string]: number } };
}

export interface IActiveWorkItemState {
    loaded: boolean;
    id?: number;
    rev?: number;
    isNew?: boolean;
    project?: string;
    workItemTypeName?: string;
    links?: WorkItemRelation[];
    relationTypes?: WorkItemRelationType[];
    sortableFields?: WorkItemField[];
    queryableFields?: WorkItemField[];
}

export const defaultSettingsState: ISettingsState = {
    loading: false
};

export const defaultRelatedWorkItemsState: IRelatedWorkItemsState = {
    loading: false
};

export const defaultActiveWorkItemState: IActiveWorkItemState = {
    loaded: false
};

export interface IChangeableValue<T> {
    originalValue: T;
    value: T;
}

export interface IChangeableSettings {
    fields: IChangeableValue<string[]>;
    sortByField: IChangeableValue<string>;
    top: IChangeableValue<number>;
}
