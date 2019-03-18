import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { getWorkItemType, getWorkItemTypesStatus, IWorkItemTypeAwareState, WorkItemTypeActions } from "Common/Redux/WorkItemTypes";
import { useCallback, useEffect } from "react";
import { useActionCreators, useMappedState } from "../../Redux";

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
