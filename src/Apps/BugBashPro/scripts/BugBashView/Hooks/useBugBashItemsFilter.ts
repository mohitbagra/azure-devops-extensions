import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { BugBashViewActions, getBugBashItemsFilterState, IBugBashViewAwareState } from "../Redux";

export function useBugBashItemsFilter(): IUseBugBashItemsFilterHookMappedState & typeof Actions {
    const { filter } = useMappedState(mapStateToProps);
    const { setFilter } = useActionCreators(Actions);

    return { filter, setFilter };
}

const Actions = {
    setFilter: BugBashViewActions.applyFilter
};

function mapStateToProps(state: IBugBashViewAwareState): IUseBugBashItemsFilterHookMappedState {
    return {
        filter: getBugBashItemsFilterState(state)
    };
}

interface IUseBugBashItemsFilterHookMappedState {
    filter?: IFilterState;
}
