import { WorkItemTemplate, WorkItemTemplateReference } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";

export interface IWorkItemTemplateAwareState {
    workItemTemplateState: IWorkItemTemplateState;
}

export interface IWorkItemTemplateState {
    templatesByTeam: { [teamId: string]: ITeamTemplates };
    templatesMap: { [id: string]: IWorkItemTemplate };
}

export interface ITeamTemplates {
    teamId: string;
    status: LoadStatus;
    error?: string;
    templates?: WorkItemTemplateReference[];
}

export interface IWorkItemTemplate {
    templateId: string;
    status: LoadStatus;
    error?: string;
    template?: WorkItemTemplate;
}

export const defaultState: IWorkItemTemplateState = {
    templatesByTeam: {},
    templatesMap: {}
};
