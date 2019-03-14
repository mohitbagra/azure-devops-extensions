import {
    IWorkItemFormNavigationService, WorkItem, WorkItemTrackingServiceIds
} from "azure-devops-extension-api/WorkItemTracking";
import * as SDK from "azure-devops-extension-sdk";

let workItemFormNavigationService: IWorkItemFormNavigationService;

export async function getWorkItemFormNavigationService(): Promise<IWorkItemFormNavigationService> {
    if (!workItemFormNavigationService) {
        workItemFormNavigationService = await SDK.getService<IWorkItemFormNavigationService>(
            WorkItemTrackingServiceIds.WorkItemFormNavigationService
        );
    }

    return workItemFormNavigationService;
}

export async function openWorkItem(workItemId: number, e?: React.MouseEvent<HTMLElement>): Promise<WorkItem> {
    const newTab = e ? e.ctrlKey : false;
    const service = await getWorkItemFormNavigationService();
    return service.openWorkItem(workItemId, newTab);
}

export async function openNewWorkItem(
    workItemTypeName: string,
    initialValues?: {
        [fieldName: string]: Object;
    }
): Promise<WorkItem> {
    const service = await getWorkItemFormNavigationService();
    return service.openNewWorkItem(workItemTypeName, initialValues);
}
