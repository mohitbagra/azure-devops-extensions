import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";

export interface IBugBashItemsAwareState {
    bugBashItemsState: IBugBashItemsState;
}

export interface IBugBashItemsState {
    status: LoadStatus;
    bugBashItems?: IBugBashItem[];
    bugBashItemMap?: { [id: string]: IBugBashItemStateModel };
    resolvedWorkItemsMap?: { [id: number]: WorkItem };
}

export interface IBugBashItemStateModel {
    status: LoadStatus;
    error?: string;
    bugBashItem?: IBugBashItem;
}

export const defaultBugBashItemsState: IBugBashItemsState = {
    status: LoadStatus.NotLoaded
};
