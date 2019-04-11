import { getClient } from "azure-devops-extension-api/Common/Client";
import { TreeStructureGroup, WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export async function fetchAreaPaths() {
    const projectId = await getCurrentProjectId();
    return getClient(WorkItemTrackingRestClient).getClassificationNode(projectId, TreeStructureGroup.Areas, undefined, 5);
}

export async function fetchIterationPaths() {
    const projectId = await getCurrentProjectId();
    return getClient(WorkItemTrackingRestClient).getClassificationNode(projectId, TreeStructureGroup.Iterations, undefined, 5);
}
