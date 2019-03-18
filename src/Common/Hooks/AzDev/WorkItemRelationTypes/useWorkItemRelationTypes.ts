import { LoadStatus } from "Common/Contracts";
import {
    getWorkItemRelationTypes,
    getWorkItemRelationTypesError,
    getWorkItemRelationTypesMap,
    getWorkItemRelationTypesStatus,
    IWorkItemRelationTypeAwareState,
    IWorkItemRelationTypeState,
    WorkItemRelationTypeActions
} from "Common/Redux/WorkItemRelationTypes";
import { useEffect } from "react";
import { useActionCreators, useMappedState } from "../../Redux";

export function useWorkItemRelationTypes(): IWorkItemRelationTypeState {
    const { relationTypes, relationTypesMap, status, error } = useMappedState(mapState);
    const { loadRelationTypes } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadRelationTypes();
        }
    }, []);

    return { relationTypes, relationTypesMap, status, error };
}

function mapState(state: IWorkItemRelationTypeAwareState): IWorkItemRelationTypeState {
    return {
        relationTypes: getWorkItemRelationTypes(state),
        relationTypesMap: getWorkItemRelationTypesMap(state),
        status: getWorkItemRelationTypesStatus(state),
        error: getWorkItemRelationTypesError(state)
    };
}

const Actions = {
    loadRelationTypes: WorkItemRelationTypeActions.loadRequested
};
