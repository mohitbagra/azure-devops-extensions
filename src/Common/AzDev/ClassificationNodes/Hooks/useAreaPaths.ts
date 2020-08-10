import { useEffect } from "react";

import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { AreaPathActions } from "../Redux/Actions";
import { IClassificationNodeAwareState, IClassificationNodeState } from "../Redux/Contracts";
import { getAreaPathError, getAreaPathNodeMapById, getAreaPathRootNode, getAreaPathStatus } from "../Redux/Selectors";

function mapState(state: IClassificationNodeAwareState): IClassificationNodeState {
    return {
        rootNode: getAreaPathRootNode(state),
        status: getAreaPathStatus(state),
        error: getAreaPathError(state),
        nodeMapById: getAreaPathNodeMapById(state),
        nodeMapByPath: getAreaPathNodeMapById(state)
    };
}

const Actions = {
    loadAreaPaths: AreaPathActions.loadRequested
};

export function useAreaPaths(): IClassificationNodeState {
    const { rootNode, nodeMapById, nodeMapByPath, error, status } = useMappedState(mapState);
    const { loadAreaPaths } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadAreaPaths();
        }
    }, []);

    return { rootNode, nodeMapById, nodeMapByPath, error, status };
}
