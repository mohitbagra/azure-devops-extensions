import { BugBashesActions, IBugBashesAwareState } from "BugBashPro/Redux/BugBashes";
import { getBugBash, getBugBashStatus } from "BugBashPro/Redux/BugBashes/Selectors";
import { IBugBash, LoadStatus } from "BugBashPro/Shared/Contracts";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import { useCallback, useEffect } from "react";

export function useBugBash(bugBashId: string): IUseBugBashHookMappedState {
    const mapStateToProps = useCallback(
        (state: IBugBashesAwareState): IUseBugBashHookMappedState => {
            return {
                bugBash: getBugBash(state, bugBashId),
                bugBashStatus: getBugBashStatus(state, bugBashId)
            };
        },
        [bugBashId]
    );

    const { bugBash, bugBashStatus } = useMappedState(mapStateToProps);
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
