import * as SDK from "azure-devops-extension-sdk";
import { routeUrl } from "Common/ServiceWrappers/LocationService";
import { getCurrentProjectName } from "Common/Utilities/WebContext";

export async function getQueryUrlAsync(workItemIds: number[], fields: string[]): Promise<string> {
    const projectName = await getCurrentProjectName();
    const url = await routeUrl("ms.vss-work-web.query-route-basic", { project: projectName });

    const wiql = `SELECT ${fields.join(",")}
                FROM WorkItems
                WHERE [System.ID] IN (${workItemIds.join(",")})`;

    return `${url}?wiql=${encodeURIComponent(wiql)}`;
}

export async function getWorkItemUrlAsync(workItemId: number): Promise<string> {
    const projectName = await getCurrentProjectName();
    return routeUrl("ms.vss-work-web.work-items-form-route-with-id", { project: projectName, id: workItemId.toString() });
}

export function getMarketplaceUrl(): string {
    const extensionId = `${SDK.getExtensionContext().publisherId}.${SDK.getExtensionContext().extensionId}`;
    return `https://marketplace.visualstudio.com/items?itemName=${extensionId}`;
}

export async function getContributionHubUrlAsync(): Promise<string> {
    const projectName = await getCurrentProjectName();
    const contributionId = SDK.getContributionId();
    const hostName = SDK.getHost().name;

    return `https://dev.azure.com/${hostName}/${projectName}/_apps/hub/${contributionId}`;
}

export async function getProjectUrlAsync(): Promise<string> {
    const projectName = await getCurrentProjectName();
    const hostName = SDK.getHost().name;

    return `https://dev.azure.com/${hostName}/${projectName}`;
}

export async function getIdentityAvatarUrlAsync(id?: string, uniqueName?: string): Promise<string> {
    if (id) {
        return routeUrl("ms.vss-tfs-web.identity-image-route", { id: id });
    } else if (uniqueName) {
        return routeUrl("ms.vss-tfs-web.identity-image-route", { identifier: uniqueName, identifierType: "0" });
    } else {
        throw new Error("Either id or uniqueName must be provided");
    }
}
