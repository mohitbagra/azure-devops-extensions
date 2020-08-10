import { useEffect } from "react";

import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { WorkItemTypeActions } from "../Redux/Actions";
import { IWorkItemTypeAwareState, IWorkItemTypeState } from "../Redux/Contracts";
import { getWorkItemTypes, getWorkItemTypesError, getWorkItemTypesMap, getWorkItemTypesStatus } from "../Redux/Selectors";

function mapState(state: IWorkItemTypeAwareState): IWorkItemTypeState {
    return {
        workItemTypes: getWorkItemTypes(state),
        workItemTypesMap: getWorkItemTypesMap(state),
        status: getWorkItemTypesStatus(state),
        error: getWorkItemTypesError(state)
    };
}

const Actions = {
    loadWorkItemTypes: WorkItemTypeActions.loadRequested
};

export function useWorkItemTypes(): IWorkItemTypeState {
    const { workItemTypes, workItemTypesMap, status, error } = useMappedState(mapState);
    const { loadWorkItemTypes } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadWorkItemTypes();
        }
    }, []);

    return { workItemTypes, workItemTypesMap, status, error };
}
