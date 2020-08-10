import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { BugBashDirectoryActions } from "../Redux/Actions";
import { IBugBashDirectoryAwareState } from "../Redux/Contracts";
import { areBugBashesSortedDescending, getBugBashesSortColumn } from "../Redux/Selectors";

export function useBugBashesSort(): IUseBugBashesSortHookMappedState & typeof Actions {
    const { sortColumn, isSortedDescending } = useMappedState(mapState);
    const { applySort } = useActionCreators(Actions);

    return { sortColumn, isSortedDescending, applySort };
}

const Actions = {
    applySort: BugBashDirectoryActions.applySort
};

function mapState(state: IBugBashDirectoryAwareState): IUseBugBashesSortHookMappedState {
    return {
        sortColumn: getBugBashesSortColumn(state),
        isSortedDescending: areBugBashesSortedDescending(state)
    };
}

interface IUseBugBashesSortHookMappedState {
    sortColumn?: string;
    isSortedDescending?: boolean;
}
