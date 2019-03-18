import { produce } from "immer";
import { TeamTemplateActionTypes, TeamTemplatesActions, WorkItemTemplateActions, WorkItemTemplateActionTypes } from "./Actions";
import { defaultState, ITeamTemplates, IWorkItemTemplate, IWorkItemTemplateState } from "./Contracts";

export function workItemTemplateReducer(
    state: IWorkItemTemplateState | undefined,
    action: TeamTemplatesActions | WorkItemTemplateActions
): IWorkItemTemplateState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case TeamTemplateActionTypes.BeginLoad: {
                const teamId = action.payload;
                draft.templatesByTeam[teamId.toLowerCase()] = {
                    teamId: teamId,
                    loading: true
                } as ITeamTemplates;
                break;
            }

            case TeamTemplateActionTypes.LoadFailed: {
                const { teamId, error } = action.payload;
                draft.templatesByTeam[teamId.toLowerCase()].error = error;
                draft.templatesByTeam[teamId.toLowerCase()].loading = false;
                break;
            }

            case TeamTemplateActionTypes.LoadSucceeded: {
                const { teamId, templates } = action.payload;
                draft.templatesByTeam[teamId.toLowerCase()] = {
                    loading: false,
                    teamId: teamId,
                    templates: templates
                };
                break;
            }

            case WorkItemTemplateActionTypes.BeginLoad: {
                const templateId = action.payload;
                draft.templatesMap[templateId.toLowerCase()] = {
                    id: templateId,
                    loading: true
                } as IWorkItemTemplate;
                break;
            }

            case WorkItemTemplateActionTypes.LoadFailed: {
                const { templateId, error } = action.payload;
                draft.templatesMap[templateId.toLowerCase()].error = error;
                draft.templatesMap[templateId.toLowerCase()].loading = false;
                break;
            }

            case WorkItemTemplateActionTypes.LoadSucceeded: {
                const template = action.payload;
                draft.templatesMap[template.id.toLowerCase()] = {
                    loading: false,
                    ...template
                };
            }
        }
    });
}
