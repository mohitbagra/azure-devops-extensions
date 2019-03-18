import { LoadStatus } from "Common/Contracts";
import {
    getWorkItemTypes,
    getWorkItemTypesError,
    getWorkItemTypesMap,
    getWorkItemTypesStatus,
    IWorkItemTypeAwareState,
    IWorkItemTypeState,
    WorkItemTypeActions
} from "Common/Redux/WorkItemTypes";
import { useEffect } from "react";
import { useActionCreators, useMappedState } from "../../Redux";

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
