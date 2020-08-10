import { useCallback, useEffect } from "react";

import { ILongText } from "BugBashPro/Shared/Contracts";
import { BugBashDetailActions } from "BugBashPro/Shared/Redux/BugBashDetails/Actions";
import { IBugBashDetailsAwareState } from "BugBashPro/Shared/Redux/BugBashDetails/Contracts";
import { getBugBashDetails, getBugBashDetailsError, getBugBashDetailsStatus } from "BugBashPro/Shared/Redux/BugBashDetails/Selectors";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

export function useBugBashDetails(bugBashId: string): IUseBugBashDetailsMappedState {
    const mapState = useCallback(
        (state: IBugBashDetailsAwareState): IUseBugBashDetailsMappedState => {
            return {
                details: getBugBashDetails(state, bugBashId),
                status: getBugBashDetailsStatus(state, bugBashId),
                error: getBugBashDetailsError(state, bugBashId)
            };
        },
        [bugBashId]
    );
    const { details, error, status } = useMappedState(mapState);
    const { requestBugBashDetailsLoad } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            requestBugBashDetailsLoad(bugBashId);
        }
    }, [bugBashId]);

    return { details, error, status };
}

interface IUseBugBashDetailsMappedState {
    details: ILongText | undefined;
    status: LoadStatus;
    error: string | undefined;
}

const Actions = {
    requestBugBashDetailsLoad: BugBashDetailActions.bugBashDetailsLoadRequested
};
