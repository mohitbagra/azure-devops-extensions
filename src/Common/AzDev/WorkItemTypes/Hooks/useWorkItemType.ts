import { useCallback, useEffect } from "react";

import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { WorkItemTypeActions } from "../Redux/Actions";
import { IWorkItemTypeAwareState } from "../Redux/Contracts";
import { getWorkItemType, getWorkItemTypesError, getWorkItemTypesStatus } from "../Redux/Selectors";

interface IUseWorkItemTypeMappedState {
    workItemType: WorkItemType | undefined;
    status: LoadStatus;
    error: string | undefined;
}

const Actions = {
    loadWorkItemTypes: WorkItemTypeActions.loadRequested
};

export function useWorkItemType(workItemTypeName: string): IUseWorkItemTypeMappedState {
    const mapState = useCallback(
        (state: IWorkItemTypeAwareState) => {
            return {
                workItemType: getWorkItemType(state, workItemTypeName),
                status: getWorkItemTypesStatus(state),
                error: getWorkItemTypesError(state)
            };
        },
        [workItemTypeName]
    );
    const { workItemType, status, error } = useMappedState(mapState);
    const { loadWorkItemTypes } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadWorkItemTypes();
        }
    }, []);

    return { workItemType, status, error };
}
