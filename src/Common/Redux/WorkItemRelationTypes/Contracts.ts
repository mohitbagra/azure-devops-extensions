import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking";

export interface IWorkItemRelationTypeAwareState {
    workItemRelationTypeState: IWorkItemRelationTypeState;
}

export interface IWorkItemRelationTypeState {
    relationTypes?: WorkItemRelationType[];
    relationTypesMap?: { [nameOrRefName: string]: WorkItemRelationType };
    loading: boolean;
    error?: string;
}

export const defaultState: IWorkItemRelationTypeState = {
    loading: false
};
