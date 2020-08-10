import { WorkItemTemplateReference } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { equals } from "azure-devops-ui/Core/Util/String";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";

import { ITeamTemplates, IWorkItemTemplate, IWorkItemTemplateAwareState, IWorkItemTemplateState } from "./Contracts";

export function getWorkItemTemplatesState(state: IWorkItemTemplateAwareState): IWorkItemTemplateState | undefined {
    return state.workItemTemplateState;
}

export function getTeamTemplatesState(state: IWorkItemTemplateAwareState, teamId: string): ITeamTemplates | undefined {
    const templateState = getWorkItemTemplatesState(state);
    return templateState && templateState.templatesByTeam && templateState.templatesByTeam[teamId.toLowerCase()];
}

export const getTeamTemplates = createSelector(getTeamTemplatesState, (state: ITeamTemplates | undefined) => state && state.templates);

export const getTeamTemplatesStatus = createSelector(
    getTeamTemplatesState,
    (state: ITeamTemplates | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getTeamTemplatesError = createSelector(getTeamTemplatesState, (state: ITeamTemplates | undefined) => state && state.error);

export function getTeamTemplate(state: IWorkItemTemplateAwareState, teamId: string, templateId: string): WorkItemTemplateReference | undefined {
    const templateState = getWorkItemTemplatesState(state);
    const teamTemplate =
        templateState &&
        templateState.templatesByTeam &&
        templateState.templatesByTeam[teamId.toLowerCase()] &&
        templateState.templatesByTeam[teamId.toLowerCase()].templates;
    return teamTemplate && teamTemplate.find((t) => equals(t.id, templateId, true));
}

export function getTemplateState(state: IWorkItemTemplateAwareState, templateId: string): IWorkItemTemplate | undefined {
    const templateState = getWorkItemTemplatesState(state);
    return templateState && templateState.templatesMap && templateState.templatesMap[templateId.toLowerCase()];
}

export const getTemplate = createSelector(getTemplateState, (state: IWorkItemTemplate | undefined) => state && state.template);

export const getTemplateStatus = createSelector(
    getTemplateState,
    (state: IWorkItemTemplate | undefined) => (state && state.status) || LoadStatus.NotLoaded
);

export const getTemplateError = createSelector(getTemplateState, (state: IWorkItemTemplate | undefined) => state && state.error);
