import { useEffect } from "react";

import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { IBugBashItemsAwareState } from "BugBashPro/Shared/Redux/BugBashItems/Contracts";
import { getBugBashItemsStatus, getResolvedWorkItemsMap } from "BugBashPro/Shared/Redux/BugBashItems/Selectors";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { BugBashItemsFilterData, IBugBashViewAwareState } from "../Redux/Contracts";
import { getBugBashViewFilterData, getFilteredBugBashItems } from "../Redux/Selectors";

export function useFilteredBugBashItems(bugBashId: string): IUseBugBashItemsHookMappedState {
    const { filteredBugBashItems, workItemsMap, filterData, status } = useMappedState(mapState);
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

function mapState(state: IBugBashViewAwareState & IBugBashItemsAwareState): IUseBugBashItemsHookMappedState {
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
