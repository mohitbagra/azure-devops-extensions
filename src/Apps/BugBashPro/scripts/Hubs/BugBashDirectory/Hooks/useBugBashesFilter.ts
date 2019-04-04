import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { BugBashDirectoryActions } from "../Redux/Actions";
import { IBugBashDirectoryAwareState } from "../Redux/Contracts";
import { getBugBashesFilterState } from "../Redux/Selectors";

export function useBugBashesFilter(): IUseBugBashesFilterHookMappedState & typeof Actions {
    const { filter } = useMappedState(mapState);
    const { setFilter } = useActionCreators(Actions);

    return { filter, setFilter };
}

const Actions = {
    setFilter: BugBashDirectoryActions.applyFilter
};

function mapState(state: IBugBashDirectoryAwareState): IUseBugBashesFilterHookMappedState {
    return {
        filter: getBugBashesFilterState(state)
    };
}

interface IUseBugBashesFilterHookMappedState {
    filter?: IFilterState;
}
