import {
    WorkItemTemplate, WorkItemTemplateReference
} from "azure-devops-extension-api/WorkItemTracking";

export interface IWorkItemTemplateAwareState {
    workItemTemplateState: IWorkItemTemplateState;
}

export interface IWorkItemTemplateState {
    templatesByTeam: { [teamId: string]: ITeamTemplates };
    templatesMap: { [id: string]: IWorkItemTemplate };
}

export interface ITeamTemplates {
    teamId: string;
    loading: boolean;
    error?: string;
    templates?: WorkItemTemplateReference[];
}

export interface IWorkItemTemplate extends WorkItemTemplate {
    loading: boolean;
    error?: string;
}

export const defaultState: IWorkItemTemplateState = {
    templatesByTeam: {},
    templatesMap: {}
};
