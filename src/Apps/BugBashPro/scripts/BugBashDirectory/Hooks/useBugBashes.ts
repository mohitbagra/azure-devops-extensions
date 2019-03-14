import { useEffect } from "react";
import {
    BugBashesActions, getBugBashesStatus, IBugBashesAwareState
} from "BugBashPro/Redux/BugBashes";
import { IBugBash, LoadStatus } from "BugBashPro/Shared/Contracts";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    getBugBashCounts, getFilteredBugBashes, IBugBashCounts, IBugBashDirectoryAwareState
} from "../Redux";

export function useBugBashes(): IUseBugBashesHookMappedState & typeof Actions {
    const { filteredBugBashes, status, bugBashCounts } = useMappedState(mapStateToProps);
    const { loadBugBashes, deleteBugBash } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadBugBashes();
        }
    }, []);

    return { filteredBugBashes, status, bugBashCounts, loadBugBashes, deleteBugBash };
}

const Actions = {
    loadBugBashes: BugBashesActions.bugBashesLoadRequested,
    deleteBugBash: BugBashesActions.bugBashDeleteRequested
};

function mapStateToProps(state: IBugBashDirectoryAwareState & IBugBashesAwareState): IUseBugBashesHookMappedState {
    return {
        filteredBugBashes: getFilteredBugBashes(state),
        status: getBugBashesStatus(state),
        bugBashCounts: getBugBashCounts(state)
    };
}

interface IUseBugBashesHookMappedState {
    filteredBugBashes?: IBugBash[];
    status: LoadStatus;
    bugBashCounts?: IBugBashCounts;
}
