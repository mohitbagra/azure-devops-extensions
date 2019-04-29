import { ChecklistType, IChecklist } from "Checklist/Interfaces";
import { ChecklistActions } from "Checklist/Redux/Actions";
import { IChecklistAwareState } from "Checklist/Redux/Contracts";
import { getChecklist, getChecklistError, getChecklistStatus } from "Checklist/Redux/Selectors";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";

export function useChecklist(
    idOrType: number | string,
    checklistType: ChecklistType,
    loadIfNotLoaded: boolean = true
): IUseWorkItemChecklistHookMappedState {
    const mapState = useCallback(
        (state: IChecklistAwareState): IUseWorkItemChecklistHookMappedState => {
            return {
                checklist: getChecklist(state, idOrType, checklistType),
                error: getChecklistError(state, idOrType),
                status: getChecklistStatus(state, idOrType)
            };
        },
        [idOrType, checklistType]
    );

    const { checklist, status, error } = useMappedState(mapState);
    const { loadChecklist } = useActionCreators(Actions);

    useEffect(() => {
        if (loadIfNotLoaded && status === LoadStatus.NotLoaded) {
            loadChecklist(idOrType);
        }
    }, [idOrType]);

    return { checklist, status, error };
}

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested
};

interface IUseWorkItemChecklistHookMappedState {
    status: LoadStatus;
    error: string | undefined;
    checklist: IChecklist | undefined;
}
