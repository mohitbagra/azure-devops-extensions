import { getClient } from "azure-devops-extension-api";
import {
    WorkItem, WorkItemErrorPolicy, WorkItemExpand, WorkItemTrackingRestClient
} from "azure-devops-extension-api/WorkItemTracking";

export async function fetchQueryResults(wiql: string, projectIdOrName?: string, top?: number): Promise<WorkItem[]> {
    const witClient = await getClient(WorkItemTrackingRestClient);
    const queryResult = await witClient.queryByWiql({ query: wiql }, projectIdOrName, undefined, false, top);
    if (queryResult.workItems && queryResult.workItems.length > 0) {
        return witClient.getWorkItems(
            queryResult.workItems.map(w => w.id),
            projectIdOrName,
            undefined,
            undefined,
            undefined,
            WorkItemErrorPolicy.Omit
        );
    } else {
        return [];
    }
}

export async function fetchWorkItems(ids: number[], projectIdOrName?: string): Promise<WorkItem[]> {
    const witClient = await getClient(WorkItemTrackingRestClient);
    return witClient.getWorkItems(ids, projectIdOrName, undefined, undefined, WorkItemExpand.Fields, WorkItemErrorPolicy.Omit);
}
