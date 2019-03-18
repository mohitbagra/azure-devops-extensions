import { TreeNodeStructureType } from "azure-devops-extension-api/WorkItemTracking";

export interface IClassificationNodeAwareState {
    areaPathState: IClassificationNodeState;
    iterationPathState: IClassificationNodeState;
}

export interface IClassificationNodeState {
    rootNode?: IClassificationNode;
    nodeMapById?: { [id: number]: IClassificationNode };
    nodeMapByPath?: { [path: string]: IClassificationNode };
    loading: boolean;
    error?: string;
}

export const defaultState: IClassificationNodeState = {
    loading: false
};

export interface IClassificationNode {
    attributes: {
        [key: string]: any;
    };
    children: IClassificationNode[];
    hasChildren: boolean;
    id: number;
    identifier: string;
    name: string;
    structureType: TreeNodeStructureType;
    path: string;
}
