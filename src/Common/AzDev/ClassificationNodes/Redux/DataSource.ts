import { getClient } from "azure-devops-extension-api";
import {
    TreeStructureGroup, WorkItemTrackingRestClient
} from "azure-devops-extension-api/WorkItemTracking";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchAreaPaths = memoizePromise(
    async () => {
        const projectId = await getCurrentProjectId();
        return getClient(WorkItemTrackingRestClient).getClassificationNode(projectId, TreeStructureGroup.Areas, undefined, 5);
    },
    () => "areaPaths"
);

export const fetchIterationPaths = memoizePromise(
    async () => {
        const projectId = await getCurrentProjectId();
        return getClient(WorkItemTrackingRestClient).getClassificationNode(projectId, TreeStructureGroup.Iterations, undefined, 5);
    },
    () => "iterationPaths"
);
