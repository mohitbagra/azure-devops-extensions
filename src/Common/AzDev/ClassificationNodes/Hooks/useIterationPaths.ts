import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";
import {
    getIterationPathError,
    getIterationPathNodeMapById,
    getIterationPathRootNode,
    getIterationPathStatus,
    IClassificationNodeAwareState,
    IClassificationNodeState,
    IterationPathActions
} from "../Redux";

export function useIterationPaths(): IClassificationNodeState {
    const { rootNode, nodeMapById, nodeMapByPath, error, status } = useMappedState(mapState);
    const { loadIterationPaths } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadIterationPaths();
        }
    }, []);

    return { rootNode, nodeMapById, nodeMapByPath, error, status };
}

function mapState(state: IClassificationNodeAwareState): IClassificationNodeState {
    return {
        rootNode: getIterationPathRootNode(state),
        status: getIterationPathStatus(state),
        error: getIterationPathError(state),
        nodeMapById: getIterationPathNodeMapById(state),
        nodeMapByPath: getIterationPathNodeMapById(state)
    };
}

const Actions = {
    loadIterationPaths: IterationPathActions.loadRequested
};
