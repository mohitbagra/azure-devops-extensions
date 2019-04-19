import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { BugBashItemsFilterData } from "./Redux/Contracts";

export interface IBugBashViewBaseProps {
    bugBashId: string;
}

export interface IBugBashItemProviderParams {
    filteredBugBashItems: IBugBashItem[];
    workItemsMap: { [id: number]: WorkItem } | undefined;
    status: LoadStatus;
    filterData: BugBashItemsFilterData | undefined;
}
