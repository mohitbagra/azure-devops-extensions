import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking";

export interface IWorkItemTypeAwareState {
    workItemTypeState: IWorkItemTypeState;
}

export interface IWorkItemTypeState {
    workItemTypes?: WorkItemType[];
    workItemTypesMap?: { [name: string]: WorkItemType };
    loading: boolean;
    error?: string;
}

export const defaultState: IWorkItemTypeState = {
    loading: false
};
