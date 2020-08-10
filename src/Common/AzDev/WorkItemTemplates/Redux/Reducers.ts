import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";

import { TeamTemplateActionTypes, TeamTemplatesActions, WorkItemTemplateActions, WorkItemTemplateActionTypes } from "./Actions";
import { defaultState, IWorkItemTemplateState } from "./Contracts";

export function workItemTemplateReducer(
    state: IWorkItemTemplateState | undefined,
    action: TeamTemplatesActions | WorkItemTemplateActions
): IWorkItemTemplateState {
    return produce(state || defaultState, (draft) => {
        switch (action.type) {
            case TeamTemplateActionTypes.BeginLoad: {
                const teamId = action.payload;
                draft.templatesByTeam[teamId.toLowerCase()] = {
                    teamId: teamId,
                    status: LoadStatus.Loading
                };
                break;
            }

            case TeamTemplateActionTypes.LoadFailed: {
                const { teamId, error } = action.payload;
                draft.templatesByTeam[teamId.toLowerCase()] = {
                    teamId: teamId,
                    status: LoadStatus.LoadFailed,
                    error: error
                };
                break;
            }

            case TeamTemplateActionTypes.LoadSucceeded: {
                const { teamId, templates } = action.payload;
                draft.templatesByTeam[teamId.toLowerCase()] = {
                    status: LoadStatus.Ready,
                    teamId: teamId,
                    templates: templates
                };
                break;
            }

            case WorkItemTemplateActionTypes.BeginLoad: {
                const templateId = action.payload;
                draft.templatesMap[templateId.toLowerCase()] = {
                    templateId: templateId,
                    status: LoadStatus.Loading
                };
                break;
            }

            case WorkItemTemplateActionTypes.LoadFailed: {
                const { templateId, error } = action.payload;
                draft.templatesMap[templateId.toLowerCase()] = {
                    templateId: templateId,
                    status: LoadStatus.LoadFailed,
                    error: error
                };
                break;
            }

            case WorkItemTemplateActionTypes.LoadSucceeded: {
                const template = action.payload;
                draft.templatesMap[template.id.toLowerCase()] = {
                    templateId: template.id,
                    status: LoadStatus.Ready,
                    template: template
                };
            }
        }
    });
}
