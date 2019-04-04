import { getClient } from "azure-devops-extension-api/Common/Client";
import { WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchWorkItemTypeStates = memoizePromise(
    async (workItemTypeName: string) => {
        const projectId = await getCurrentProjectId();
        return getClient(WorkItemTrackingRestClient).getWorkItemTypeStates(projectId, workItemTypeName);
    },
    (workItemTypeName: string) => workItemTypeName.toLowerCase()
);
