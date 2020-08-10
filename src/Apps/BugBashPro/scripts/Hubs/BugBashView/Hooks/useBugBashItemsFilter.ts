import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { BugBashViewActions } from "../Redux/Actions";
import { IBugBashViewAwareState } from "../Redux/Contracts";
import { getBugBashItemsFilterState } from "../Redux/Selectors";

export function useBugBashItemsFilter(): IUseBugBashItemsFilterHookMappedState & typeof Actions {
    const { filter } = useMappedState(mapState);
    const { setFilter } = useActionCreators(Actions);

    return { filter, setFilter };
}

const Actions = {
    setFilter: BugBashViewActions.applyFilter
};

function mapState(state: IBugBashViewAwareState): IUseBugBashItemsFilterHookMappedState {
    return {
        filter: getBugBashItemsFilterState(state)
    };
}

interface IUseBugBashItemsFilterHookMappedState {
    filter?: IFilterState;
}
