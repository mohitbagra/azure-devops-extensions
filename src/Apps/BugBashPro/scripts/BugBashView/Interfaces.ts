import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IBugBash, IBugBashItem } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { BugBashItemsFilterData } from "./Redux/Contracts";

export interface IBugBashViewBaseProps {
    bugBash: IBugBash;
}

export interface IBugBashItemProviderParams {
    filteredBugBashItems: IBugBashItem[];
    workItemsMap: { [id: number]: WorkItem } | undefined;
    status: LoadStatus;
    filterData: BugBashItemsFilterData | undefined;
}
