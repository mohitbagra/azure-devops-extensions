import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { BugBashViewActions } from "../Redux/Actions";
import { IBugBashViewAwareState } from "../Redux/Contracts";
import { areBugBashItemsSortedDescending, getBugBashItemsSortColumn } from "../Redux/Selectors";

export function useBugBashItemsSort(): IUseBugBashItemsSortHookMappedState & typeof Actions {
    const { sortColumn, isSortedDescending } = useMappedState(mapState);
    const { applySort } = useActionCreators(Actions);

    return { sortColumn, isSortedDescending, applySort };
}

const Actions = {
    applySort: BugBashViewActions.applySort
};

function mapState(state: IBugBashViewAwareState): IUseBugBashItemsSortHookMappedState {
    return {
        sortColumn: getBugBashItemsSortColumn(state),
        isSortedDescending: areBugBashItemsSortedDescending(state)
    };
}

interface IUseBugBashItemsSortHookMappedState {
    sortColumn?: string;
    isSortedDescending?: boolean;
}
