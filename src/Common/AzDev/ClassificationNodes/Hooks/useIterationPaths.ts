import { useEffect } from "react";

import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { IterationPathActions } from "../Redux/Actions";
import { IClassificationNodeAwareState, IClassificationNodeState } from "../Redux/Contracts";
import { getIterationPathError, getIterationPathNodeMapById, getIterationPathRootNode, getIterationPathStatus } from "../Redux/Selectors";

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
