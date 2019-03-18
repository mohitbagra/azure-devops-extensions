import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";
import {
    AreaPathActions,
    getAreaPathError,
    getAreaPathNodeMapById,
    getAreaPathRootNode,
    getAreaPathStatus,
    IClassificationNodeAwareState,
    IClassificationNodeState
} from "../Redux";

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
