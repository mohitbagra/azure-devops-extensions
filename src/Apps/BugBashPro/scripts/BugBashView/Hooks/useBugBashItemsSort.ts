import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    areBugBashItemsSortedDescending, BugBashViewActions, getBugBashItemsSortColumn,
    IBugBashViewAwareState
} from "../Redux";

export function useBugBashItemsSort(): IUseBugBashItemsSortHookMappedState & typeof Actions {
    const { sortColumn, isSortedDescending } = useMappedState(mapStateToProps);
    const { applySort } = useActionCreators(Actions);

    return { sortColumn, isSortedDescending, applySort };
}

const Actions = {
    applySort: BugBashViewActions.applySort
};

function mapStateToProps(state: IBugBashViewAwareState): IUseBugBashItemsSortHookMappedState {
    return {
        sortColumn: getBugBashItemsSortColumn(state),
        isSortedDescending: areBugBashItemsSortedDescending(state)
    };
}

interface IUseBugBashItemsSortHookMappedState {
    sortColumn?: string;
    isSortedDescending?: boolean;
}
