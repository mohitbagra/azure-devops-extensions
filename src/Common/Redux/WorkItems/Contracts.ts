import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";

export interface IWorkItemAwareState {
    workItemState: IWorkItemState;
}

export interface IWorkItemState {
    workItemsMap: { [id: number]: IWorkItem };
}

export const defaultState: IWorkItemState = {
    workItemsMap: {}
};

export interface IWorkItem extends WorkItem {
    error?: string;
    status: WorkItemStatus;
}

export const enum WorkItemStatus {
    Loading = 0,
    Loaded,
    LoadFailed
}
