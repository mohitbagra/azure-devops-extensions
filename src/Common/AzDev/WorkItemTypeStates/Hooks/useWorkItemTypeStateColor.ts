import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { WorkItemTypeStateActions } from "../Redux/Actions";
import { IWorkItemTypeStateAwareState } from "../Redux/Contracts";
import { getWorkItemTypeStateColor, getWorkItemTypeStatesStatus } from "../Redux/Selectors";

export function useWorkItemTypeStateColor(workItemTypeName: string, stateName: string): string | undefined {
    const mapState = useCallback(
        (state: IWorkItemTypeStateAwareState): IUseWorkItemTypeStateMappedState => {
            return {
                color: getWorkItemTypeStateColor(state, workItemTypeName, stateName),
                status: getWorkItemTypeStatesStatus(state, workItemTypeName)
            };
        },
        [workItemTypeName, stateName]
    );
    const { color, status } = useMappedState(mapState);
    const { loadWorkItemTypeStates } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadWorkItemTypeStates(workItemTypeName);
        }
    }, [workItemTypeName]);

    return color;
}

interface IUseWorkItemTypeStateMappedState {
    color: string | undefined;
    status: LoadStatus;
}

const Actions = { loadWorkItemTypeStates: WorkItemTypeStateActions.loadRequested };
