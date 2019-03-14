import { useEffect } from "react";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import {
    BugBashItemsActions, getBugBashItemsStatus, getResolvedWorkItemsMap, IBugBashItemsAwareState
} from "BugBashPro/Redux/BugBashItems";
import { IBugBashItem, LoadStatus } from "BugBashPro/Shared/Contracts";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    BugBashItemsFilterData, getBugBashViewFilterData, getFilteredBugBashItems,
    IBugBashViewAwareState
} from "../Redux";

export function useBugBashItems(bugBashId: string): IUseBugBashItemsHookMappedState & typeof Actions {
    const { filteredBugBashItems, workItemsMap, filterData, status } = useMappedState(mapStateToProps);
    const { loadBugBashItems, deleteBugBashItem } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadBugBashItems(bugBashId);
        }
    }, [bugBashId]);

    return { filteredBugBashItems, workItemsMap, filterData, status, loadBugBashItems, deleteBugBashItem };
}

const Actions = {
    loadBugBashItems: BugBashItemsActions.bugBashItemsLoadRequested,
    deleteBugBashItem: BugBashItemsActions.bugBashItemDeleteRequested
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
