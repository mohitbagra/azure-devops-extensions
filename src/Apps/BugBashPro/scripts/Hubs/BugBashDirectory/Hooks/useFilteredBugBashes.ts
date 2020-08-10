import { useEffect } from "react";

import { IBugBash } from "BugBashPro/Shared/Contracts";
import { BugBashesActions } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { IBugBashesAwareState } from "BugBashPro/Shared/Redux/BugBashes/Contracts";
import { getBugBashesStatus } from "BugBashPro/Shared/Redux/BugBashes/Selectors";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { IBugBashCounts, IBugBashDirectoryAwareState } from "../Redux/Contracts";
import { getBugBashCounts, getFilteredBugBashes } from "../Redux/Selectors";

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
