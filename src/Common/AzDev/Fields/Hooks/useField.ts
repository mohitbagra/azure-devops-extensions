import { WorkItemField } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { FieldActions } from "../Redux/Actions";
import { IFieldAwareState } from "../Redux/Contracts";
import { getField, getFieldsError, getFieldsStatus } from "../Redux/Selectors";

export function useField(fildNameOrRefName: string): IUseFieldMappedState {
    const mapState = useCallback(
        (state: IFieldAwareState) => {
            return {
                field: getField(state, fildNameOrRefName),
                status: getFieldsStatus(state),
                error: getFieldsError(state)
            };
        },
        [fildNameOrRefName]
    );
    const { field, status, error } = useMappedState(mapState);
    const { loadFields } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadFields();
        }
    }, []);

    return { field, status, error };
}

interface IUseFieldMappedState {
    field: WorkItemField | undefined;
    status: LoadStatus;
    error: string | undefined;
}

const Actions = {
    loadFields: FieldActions.loadRequested
};
