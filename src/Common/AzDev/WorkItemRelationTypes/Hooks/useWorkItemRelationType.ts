import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { getWorkItemRelationType, getWorkItemRelationTypesStatus, IWorkItemRelationTypeAwareState, WorkItemRelationTypeActions } from "../Redux";

export function useWorkItemRelationType(nameOrRefName: string): { relationType: WorkItemRelationType | undefined; status: LoadStatus } {
    const mapState = useCallback(
        (state: IWorkItemRelationTypeAwareState) => {
            return {
                relationType: getWorkItemRelationType(state, nameOrRefName),
                status: getWorkItemRelationTypesStatus(state)
            };
        },
        [nameOrRefName]
    );
    const { relationType, status } = useMappedState(mapState);
    const { loadRelationTypes } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadRelationTypes();
        }
    }, []);

    return { relationType, status };
}

const Actions = {
    loadRelationTypes: WorkItemRelationTypeActions.loadRequested
};
