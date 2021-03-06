import { useCallback, useEffect } from "react";

import { WorkItemTypeFieldWithReferences } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { WorkItemTypeFieldActions } from "../Redux/Actions";
import { IFieldAwareState } from "../Redux/Contracts";
import { getWorkItemTypeFields, getWorkItemTypeFieldsError, getWorkItemTypeFieldsMap, getWorkItemTypeFieldsStatus } from "../Redux/Selectors";

interface IUseWorkItemTypeFieldsMappedState {
    status: LoadStatus;
    fields: WorkItemTypeFieldWithReferences[] | undefined;
    fieldsMap: { [nameOrRefName: string]: WorkItemTypeFieldWithReferences } | undefined;
    error: string | undefined;
}

const Actions = {
    loadWorkItemTypeFields: WorkItemTypeFieldActions.loadRequested
};

export function useWorkItemTypeFields(workItemTypeName: string): IUseWorkItemTypeFieldsMappedState {
    const mapState = useCallback(
        (state: IFieldAwareState) => {
            return {
                fields: getWorkItemTypeFields(state, workItemTypeName),
                fieldsMap: getWorkItemTypeFieldsMap(state, workItemTypeName),
                status: getWorkItemTypeFieldsStatus(state, workItemTypeName),
                error: getWorkItemTypeFieldsError(state, workItemTypeName)
            };
        },
        [workItemTypeName]
    );
    const { fields, fieldsMap, status, error } = useMappedState(mapState);
    const { loadWorkItemTypeFields } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadWorkItemTypeFields(workItemTypeName);
        }
    }, [workItemTypeName]);

    return { fields, fieldsMap, status, error };
}
