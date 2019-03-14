import {
    WorkItemTemplateReference
} from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { equals } from "azure-devops-ui/Core/Util/String";
import {
    ITeamTemplates, IWorkItemTemplate, IWorkItemTemplateAwareState, IWorkItemTemplateState
} from "Common/Redux/WorkItemTemplates/Contracts";

export function getWorkItemTemplatesState(state: IWorkItemTemplateAwareState): IWorkItemTemplateState | undefined {
    return state.workItemTemplateState;
}

export function getTeamTemplates(state: IWorkItemTemplateAwareState, teamId: string): ITeamTemplates | undefined {
    const templateState = getWorkItemTemplatesState(state);
    return templateState && templateState.templatesByTeam && templateState.templatesByTeam[teamId.toLowerCase()];
}

export function getTeamTemplate(state: IWorkItemTemplateAwareState, teamId: string, templateId: string): WorkItemTemplateReference | undefined {
    const templateState = getWorkItemTemplatesState(state);
    const teamTemplate =
        templateState &&
        templateState.templatesByTeam &&
        templateState.templatesByTeam[teamId.toLowerCase()] &&
        templateState.templatesByTeam[teamId.toLowerCase()].templates;
    return teamTemplate && teamTemplate.find(t => equals(t.id, templateId, true));
}

export function getTemplate(state: IWorkItemTemplateAwareState, templateId: string): IWorkItemTemplate | undefined {
    const templateState = getWorkItemTemplatesState(state);
    return templateState && templateState.templatesMap && templateState.templatesMap[templateId.toLowerCase()];
}
