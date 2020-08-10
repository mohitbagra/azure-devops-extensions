import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";

export interface IWorkItemRelationTypeAwareState {
    workItemRelationTypeState: IWorkItemRelationTypeState;
}

export interface IWorkItemRelationTypeState {
    relationTypes?: WorkItemRelationType[];
    relationTypesMap?: { [nameOrRefName: string]: WorkItemRelationType };
    status: LoadStatus;
    error?: string;
}

export const defaultState: IWorkItemRelationTypeState = {
    status: LoadStatus.NotLoaded
};
