import { CommonServiceIds, ILocationService, TeamFoundationHostType } from "azure-devops-extension-api/Common/CommonServices";
import * as SDK from "azure-devops-extension-sdk";

let locationService: ILocationService;

export async function getLocationService(): Promise<ILocationService> {
    if (!locationService) {
        locationService = await SDK.getService<ILocationService>(CommonServiceIds.LocationService);
    }

    return locationService;
}

export async function getResourceAreaLocation(resourceAreaId: string): Promise<string> {
    const service = await getLocationService();
    return service.getResourceAreaLocation(resourceAreaId);
}

export async function getServiceLocation(serviceInstanceType?: string, hostType?: TeamFoundationHostType): Promise<string> {
    const service = await getLocationService();
    return service.getServiceLocation(serviceInstanceType, hostType);
}

export async function routeUrl(routeId: string, routeValues?: { [key: string]: string }, hostPath?: string): Promise<string> {
    const service = await getLocationService();
    return service.routeUrl(routeId, routeValues, hostPath);
}
