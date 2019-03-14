import { WorkItemClassificationNode } from "azure-devops-extension-api/WorkItemTracking";
import {
    AreaPathActions, AreaPathActionTypes, IterationPathActions, IterationPathActionTypes
} from "Common/Redux/ClassificationNodes/Actions";
import {
    defaultState, IClassificationNode, IClassificationNodeState
} from "Common/Redux/ClassificationNodes/Contracts";
import { produce } from "immer";

export function areaPathReducer(state: IClassificationNodeState | undefined, action: AreaPathActions): IClassificationNodeState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case AreaPathActionTypes.BeginLoad: {
                draft.loading = true;
                draft.nodeMapById = undefined;
                draft.nodeMapById = undefined;
                draft.rootNode = undefined;
                draft.error = undefined;
                break;
            }

            case AreaPathActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.nodeMapById = undefined;
                draft.nodeMapById = undefined;
                draft.rootNode = undefined;
                draft.loading = false;
                break;
            }

            case AreaPathActionTypes.LoadSucceeded: {
                const rootNode = action.payload;
                draft.nodeMapById = {};
                draft.nodeMapByPath = {};
                populateNodeData(rootNode, null, draft);
                draft.loading = false;
                draft.error = undefined;
            }
        }
    });
}

export function iterationPathReducer(state: IClassificationNodeState | undefined, action: IterationPathActions): IClassificationNodeState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case IterationPathActionTypes.BeginLoad: {
                draft.loading = true;
                draft.nodeMapById = undefined;
                draft.nodeMapById = undefined;
                draft.rootNode = undefined;
                draft.error = undefined;
                break;
            }

            case IterationPathActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.nodeMapById = undefined;
                draft.nodeMapById = undefined;
                draft.rootNode = undefined;
                draft.loading = false;
                break;
            }

            case IterationPathActionTypes.LoadSucceeded: {
                const rootNode = action.payload;
                populateNodeData(rootNode, null, draft);
                draft.loading = false;
                draft.error = undefined;
            }
        }
    });
}

function populateNodeData(node: WorkItemClassificationNode, parent: IClassificationNode | null, draft: IClassificationNodeState) {
    const nodePath = parent ? `${parent.path}\\${node.name}` : node.name;
    const transformedNode: IClassificationNode = { ...node, children: [], path: nodePath };
    if (parent) {
        parent.children.push(transformedNode);
    }
    if (node.children) {
        for (const child of node.children) {
            populateNodeData(child, transformedNode, draft);
        }
    }

    if (!draft.nodeMapById) {
        draft.nodeMapById = {};
    }
    if (!draft.nodeMapByPath) {
        draft.nodeMapByPath = {};
    }

    draft.nodeMapByPath[nodePath.toLowerCase()] = transformedNode;
    draft.nodeMapById[node.id] = transformedNode;

    if (!parent) {
        draft.rootNode = transformedNode;
    }
}
