import {
    WorkItemTemplate, WorkItemTemplateReference
} from "azure-devops-extension-api/WorkItemTracking";
import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const TeamTemplatesActions = {
    loadRequested: (teamId: string) => createAction(TeamTemplateActionTypes.LoadRequested, teamId),
    beginLoad: (teamId: string) => createAction(TeamTemplateActionTypes.BeginLoad, teamId),
    loadSucceeded: (teamId: string, templates: WorkItemTemplateReference[]) =>
        createAction(TeamTemplateActionTypes.LoadSucceeded, { teamId, templates }),
    loadFailed: (teamId: string, error: string) => createAction(TeamTemplateActionTypes.LoadFailed, { teamId, error })
};

export const enum TeamTemplateActionTypes {
    LoadRequested = "TeamTemplates/LoadRequested",
    BeginLoad = "TeamTemplates/BeginLoad",
    LoadSucceeded = "TeamTemplates/LoadSucceeded",
    LoadFailed = "TeamTemplates/LoadFailed"
}

export const WorkItemTemplateActions = {
    loadRequested: (teamId: string, templateId: string) => createAction(WorkItemTemplateActionTypes.LoadRequested, { teamId, templateId }),
    beginLoad: (templateId: string) => createAction(WorkItemTemplateActionTypes.BeginLoad, templateId),
    loadSucceeded: (template: WorkItemTemplate) => createAction(WorkItemTemplateActionTypes.LoadSucceeded, template),
    loadFailed: (templateId: string, error: string) => createAction(WorkItemTemplateActionTypes.LoadFailed, { templateId, error })
};

export const enum WorkItemTemplateActionTypes {
    LoadRequested = "WorkItemTemplates/LoadRequested",
    BeginLoad = "WorkItemTemplates/BeginLoad",
    LoadSucceeded = "WorkItemTemplates/LoadSucceeded",
    LoadFailed = "WorkItemTemplates/LoadFailed"
}

export type TeamTemplatesActions = ActionsUnion<typeof TeamTemplatesActions>;
export type WorkItemTemplateActions = ActionsUnion<typeof WorkItemTemplateActions>;
