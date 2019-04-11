import { getClient } from "azure-devops-extension-api/Common/Client";
import { WorkItemTrackingRestClient, WorkItemType } from "azure-devops-extension-api/WorkItemTracking";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export async function fetchWorkItemTypes() {
    const projectId = await getCurrentProjectId();
    const workItemTypes = await getClient(WorkItemTrackingRestClient).getWorkItemTypes(projectId);
    workItemTypes.sort((a: WorkItemType, b: WorkItemType) => localeIgnoreCaseComparer(a.name, b.name));
    return workItemTypes;
}
