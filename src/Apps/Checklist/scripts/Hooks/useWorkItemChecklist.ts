import { IWorkItemChecklist } from "Checklist/Interfaces";
import { WorkItemChecklistActions } from "Checklist/Redux/WorkItemChecklist/Actions";
import { IWorkItemChecklistAwareState } from "Checklist/Redux/WorkItemChecklist/Contracts";
import { getWorkItemChecklist, getWorkItemChecklistError, getWorkItemChecklistStatus } from "Checklist/Redux/WorkItemChecklist/Selectors";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";

export function useWorkItemChecklist(workItemId: number, loadIfNotLoaded: boolean = true): IUseWorkItemChecklistHookMappedState {
    const mapState = useCallback(
        (state: IWorkItemChecklistAwareState): IUseWorkItemChecklistHookMappedState => {
            return {
                checklist: getWorkItemChecklist(state, workItemId),
                error: getWorkItemChecklistError(state, workItemId),
                status: getWorkItemChecklistStatus(state, workItemId)
            };
        },
        [workItemId]
    );

    const { checklist, status, error } = useMappedState(mapState);
    const { loadWorkItemChecklist } = useActionCreators(Actions);

    useEffect(() => {
        if (loadIfNotLoaded && status === LoadStatus.NotLoaded) {
            loadWorkItemChecklist(workItemId);
        }
    }, [workItemId]);

    return { checklist, status, error };
}

const Actions = {
    loadWorkItemChecklist: WorkItemChecklistActions.workItemChecklistLoadRequested
};

interface IUseWorkItemChecklistHookMappedState {
    status: LoadStatus;
    error: string | undefined;
    checklist: IWorkItemChecklist | undefined;
}
