import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { getWorkItemTypeStateColor, getWorkItemTypeStatesStatus, IWorkItemTypeStateAwareState, WorkItemTypeStateActions } from "../Redux";

export function useWorkItemTypeStateColor(workItemTypeName: string, stateName: string): string | undefined {
    const mapStateToProps = useCallback(
        (state: IWorkItemTypeStateAwareState): IWorkItemStateViewStateProps => {
            return {
                color: getWorkItemTypeStateColor(state, workItemTypeName, stateName),
                status: getWorkItemTypeStatesStatus(state, workItemTypeName)
            };
        },
        [workItemTypeName, stateName]
    );
    const { color, status } = useMappedState(mapStateToProps);
    const { loadWorkItemTypeStates } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadWorkItemTypeStates(workItemTypeName);
        }
    }, []);

    return color;
}

interface IWorkItemStateViewStateProps {
    color?: string;
    status: LoadStatus;
}

const Actions = { loadWorkItemTypeStates: WorkItemTypeStateActions.loadRequested };
