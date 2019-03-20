import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";
import { FieldActions, getFields, getFieldsError, getFieldsMap, getFieldsStatus, IFieldAwareState, IFieldState } from "../Redux";

export function useFields(): IFieldState {
    const { fields, fieldsMap, status, error } = useMappedState(mapState);
    const { loadFields } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadFields();
        }
    }, []);

    return { fields, fieldsMap, status, error };
}

function mapState(state: IFieldAwareState): IFieldState {
    return {
        fields: getFields(state),
        fieldsMap: getFieldsMap(state),
        status: getFieldsStatus(state),
        error: getFieldsError(state)
    };
}

const Actions = {
    loadFields: FieldActions.loadRequested
};
