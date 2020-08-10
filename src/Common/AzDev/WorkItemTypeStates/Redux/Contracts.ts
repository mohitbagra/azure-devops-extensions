import { LoadStatus } from "Common/Contracts";

export interface IWorkItemTypeStateAwareState {
    workItemTypeStateState: IWorkItemTypeStateState;
}

export interface IWorkItemTypeStateState {
    statesMap: { [workItemTypeName: string]: IWorkItemTypeStateColors };
}

export interface IWorkItemTypeStateColors {
    workItemTypeName: string;
    status: LoadStatus;
    error?: string;
    stateColors?: { [stateName: string]: string };
}

export const defaultState: IWorkItemTypeStateState = {
    statesMap: {}
};
