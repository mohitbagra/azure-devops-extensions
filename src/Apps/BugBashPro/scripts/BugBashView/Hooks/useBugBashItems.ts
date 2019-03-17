import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { BugBashItemsActions, getBugBashItemsStatus, getResolvedWorkItemsMap, IBugBashItemsAwareState } from "BugBashPro/Redux/BugBashItems";
import { IBugBashItem, LoadStatus } from "BugBashPro/Shared/Contracts";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import { useEffect } from "react";
import { BugBashItemsFilterData, getBugBashViewFilterData, getFilteredBugBashItems, IBugBashViewAwareState } from "../Redux";

export function useBugBashItems(bugBashId: string): IUseBugBashItemsHookMappedState {
    const { filteredBugBashItems, workItemsMap, filterData, status } = useMappedState(mapStateToProps);
    const { loadBugBashItems } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadBugBashItems(bugBashId);
        }
    }, [bugBashId]);

    return { filteredBugBashItems, workItemsMap, filterData, status };
}

const Actions = {
    loadBugBashItems: BugBashItemsActions.bugBashItemsLoadRequested
};

function mapStateToProps(state: IBugBashViewAwareState & IBugBashItemsAwareState): IUseBugBashItemsHookMappedState {
    return {
        filteredBugBashItems: getFilteredBugBashItems(state),
        filterData: getBugBashViewFilterData(state),
        status: getBugBashItemsStatus(state),
        workItemsMap: getResolvedWorkItemsMap(state)
    };
}

interface IUseBugBashItemsHookMappedState {
    filteredBugBashItems?: IBugBashItem[];
    workItemsMap?: { [id: number]: WorkItem };
    status: LoadStatus;
    filterData?: BugBashItemsFilterData;
}
