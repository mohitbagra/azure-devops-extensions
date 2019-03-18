import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { getWorkItemType, getWorkItemTypesStatus, IWorkItemTypeAwareState, WorkItemTypeActions } from "../Redux";

export function useWorkItemType(name: string): { workItemType: WorkItemType | undefined; status: LoadStatus } {
    const mapState = useCallback(
        (state: IWorkItemTypeAwareState) => {
            return {
                workItemType: getWorkItemType(state, name),
                status: getWorkItemTypesStatus(state)
            };
        },
        [name]
    );
    const { workItemType, status } = useMappedState(mapState);
    const { loadWorkItemTypes } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadWorkItemTypes();
        }
    }, []);

    return { workItemType, status };
}

const Actions = {
    loadWorkItemTypes: WorkItemTypeActions.loadRequested
};
