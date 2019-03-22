import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { areBugBashesSortedDescending, BugBashDirectoryActions, getBugBashesSortColumn, IBugBashDirectoryAwareState } from "../Redux";

export function useBugBashesSort(): IUseBugBashesSortHookMappedState & typeof Actions {
    const { sortColumn, isSortedDescending } = useMappedState(mapStateToProps);
    const { applySort } = useActionCreators(Actions);

    return { sortColumn, isSortedDescending, applySort };
}

const Actions = {
    applySort: BugBashDirectoryActions.applySort
};

function mapStateToProps(state: IBugBashDirectoryAwareState): IUseBugBashesSortHookMappedState {
    return {
        sortColumn: getBugBashesSortColumn(state),
        isSortedDescending: areBugBashesSortedDescending(state)
    };
}

interface IUseBugBashesSortHookMappedState {
    sortColumn?: string;
    isSortedDescending?: boolean;
}
