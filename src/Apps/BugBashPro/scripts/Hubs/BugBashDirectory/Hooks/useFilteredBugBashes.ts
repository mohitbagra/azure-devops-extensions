import { IBugBash } from "BugBashPro/Shared/Contracts";
import { BugBashesActions, getBugBashesStatus, IBugBashesAwareState } from "BugBashPro/Shared/Redux/BugBashes";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";
import { getBugBashCounts, getFilteredBugBashes, IBugBashCounts, IBugBashDirectoryAwareState } from "../Redux";

export function useFilteredBugBashes(): IUseBugBashesHookMappedState {
    const { filteredBugBashes, status, bugBashCounts } = useMappedState(mapState);
    const { loadBugBashes } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadBugBashes();
        }
    }, []);

    return { filteredBugBashes, status, bugBashCounts };
}

const Actions = {
    loadBugBashes: BugBashesActions.bugBashesLoadRequested
};

function mapState(state: IBugBashDirectoryAwareState & IBugBashesAwareState): IUseBugBashesHookMappedState {
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
