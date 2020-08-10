import { useCallback, useEffect } from "react";

import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { WorkItemRelationTypeActions } from "../Redux/Actions";
import { IWorkItemRelationTypeAwareState } from "../Redux/Contracts";
import { getWorkItemRelationType, getWorkItemRelationTypesError, getWorkItemRelationTypesStatus } from "../Redux/Selectors";

interface IUseWorkItemRelationTypeMappedState {
    relationType: WorkItemRelationType | undefined;
    status: LoadStatus;
    error: string | undefined;
}

const Actions = {
    loadRelationTypes: WorkItemRelationTypeActions.loadRequested
};

export function useWorkItemRelationType(nameOrRefName: string): IUseWorkItemRelationTypeMappedState {
    const mapState = useCallback(
        (state: IWorkItemRelationTypeAwareState) => {
            return {
                relationType: getWorkItemRelationType(state, nameOrRefName),
                status: getWorkItemRelationTypesStatus(state),
                error: getWorkItemRelationTypesError(state)
            };
        },
        [nameOrRefName]
    );
    const { relationType, status, error } = useMappedState(mapState);
    const { loadRelationTypes } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadRelationTypes();
        }
    }, []);

    return { relationType, status, error };
}
