import { WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { getWorkItemTypeField, getWorkItemTypeFieldsError, getWorkItemTypeFieldsStatus, IFieldAwareState, WorkItemTypeFieldActions } from "../Redux";

export function useWorkItemTypeField(workItemTypeName: string, fieldNameOrRefName: string): IUseWorkItemTypeFieldMappedState {
    const mapState = useCallback(
        (state: IFieldAwareState) => {
            return {
                field: getWorkItemTypeField(state, workItemTypeName, fieldNameOrRefName),
                status: getWorkItemTypeFieldsStatus(state, workItemTypeName),
                error: getWorkItemTypeFieldsError(state, workItemTypeName)
            };
        },
        [workItemTypeName, fieldNameOrRefName]
    );
    const { field, status, error } = useMappedState(mapState);
    const { loadWorkItemTypeFields } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadWorkItemTypeFields(workItemTypeName);
        }
    }, [workItemTypeName]);

    return { field, status, error };
}

interface IUseWorkItemTypeFieldMappedState {
    status: LoadStatus;
    field: WorkItemTypeFieldWithReferences | undefined;
    error: string | undefined;
}

const Actions = {
    loadWorkItemTypeFields: WorkItemTypeFieldActions.loadRequested
};
