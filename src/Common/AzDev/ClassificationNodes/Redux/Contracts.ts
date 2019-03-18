import { TreeNodeStructureType } from "azure-devops-extension-api/WorkItemTracking";
import { LoadStatus } from 'Common/Contracts';

export interface IClassificationNodeAwareState {
    areaPathState: IClassificationNodeState;
    iterationPathState: IClassificationNodeState;
}

export interface IClassificationNodeState {
    rootNode?: IClassificationNode;
    nodeMapById?: { [id: number]: IClassificationNode };
    nodeMapByPath?: { [path: string]: IClassificationNode };
    status: LoadStatus;
    error?: string;
}

export const defaultState: IClassificationNodeState = {
    status: LoadStatus.NotLoaded
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
