import { getClient } from "azure-devops-extension-api/Common/Client";
import {
    WorkItemTemplateReference, WorkItemTrackingRestClient
} from "azure-devops-extension-api/WorkItemTracking";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchTeamTemplates = memoizePromise(
    async (teamId: string) => {
        const projectId = await getCurrentProjectId();
        const workItemTemplates = await getClient(WorkItemTrackingRestClient).getTemplates(projectId, teamId);
        workItemTemplates.sort((a: WorkItemTemplateReference, b: WorkItemTemplateReference) => localeIgnoreCaseComparer(a.name, b.name));
        return workItemTemplates;
    },
    (teamId: string) => teamId.toLowerCase()
);

export const fetchTemplate = memoizePromise(
    async (teamId: string, templateId: string) => {
        const projectId = await getCurrentProjectId();
        return getClient(WorkItemTrackingRestClient).getTemplate(projectId, teamId, templateId);
    },
    (teamId: string, templateId: string) => `${teamId}_${templateId}`.toLowerCase()
);
