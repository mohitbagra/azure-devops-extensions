import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";

export interface IWorkItemTypeAwareState {
    workItemTypeState: IWorkItemTypeState;
}

export interface IWorkItemTypeState {
    workItemTypes?: WorkItemType[];
    workItemTypesMap?: { [name: string]: WorkItemType };
    status: LoadStatus;
    error?: string;
}

export const defaultState: IWorkItemTypeState = {
    status: LoadStatus.NotLoaded
};
