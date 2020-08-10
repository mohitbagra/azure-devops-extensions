import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { BugBashViewActions } from "../Redux/Actions";
import { BugBashViewMode, IBugBashViewAwareState } from "../Redux/Contracts";
import { getBugBashViewMode } from "../Redux/Selectors";

export function useBugBashViewMode(): IUseBugBashViewModeHookMappedState & typeof Actions {
    const { viewMode } = useMappedState(mapState);
    const { setViewMode } = useActionCreators(Actions);

    return { viewMode, setViewMode };
}

const Actions = {
    setViewMode: BugBashViewActions.setViewMode
};

function mapState(state: IBugBashViewAwareState): IUseBugBashViewModeHookMappedState {
    return {
        viewMode: getBugBashViewMode(state)
    };
}

interface IUseBugBashViewModeHookMappedState {
    viewMode: BugBashViewMode;
}
