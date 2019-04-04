import { IBugBash } from "BugBashPro/Shared/Contracts";
import { BugBashesActions } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { IBugBashesAwareState } from "BugBashPro/Shared/Redux/BugBashes/Contracts";
import { getBugBash, getBugBashStatus } from "BugBashPro/Shared/Redux/BugBashes/Selectors";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";

export function useBugBash(bugBashId: string): IUseBugBashHookMappedState {
    const mapState = useCallback(
        (state: IBugBashesAwareState): IUseBugBashHookMappedState => {
            return {
                bugBash: getBugBash(state, bugBashId),
                bugBashStatus: getBugBashStatus(state, bugBashId)
            };
        },
        [bugBashId]
    );

    const { bugBash, bugBashStatus } = useMappedState(mapState);
    const { loadBugBash } = useActionCreators(Actions);

    useEffect(() => {
        if (!bugBash && bugBashStatus === LoadStatus.NotLoaded) {
            loadBugBash(bugBashId);
        }
    }, [bugBashId]);

    return { bugBash, bugBashStatus };
}

const Actions = {
    loadBugBash: BugBashesActions.bugBashLoadRequested
};

interface IUseBugBashHookMappedState {
    bugBash?: IBugBash;
    bugBashStatus: LoadStatus;
}
