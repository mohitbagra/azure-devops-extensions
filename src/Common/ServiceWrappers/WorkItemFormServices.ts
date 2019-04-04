import { WorkItemField } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import * as SDK from "azure-devops-extension-sdk";
import { equals } from "azure-devops-ui/Core/Util/String";
import { CoreFieldRefNames } from "Common/Constants";
import { first } from "Common/Utilities/Array";

let workItemFormService: IWorkItemFormService;

export async function getWorkItemFormService(): Promise<IWorkItemFormService> {
    if (!workItemFormService) {
        workItemFormService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
    }

    return workItemFormService;
}

export async function getWorkItemType(): Promise<string> {
    const service = await getWorkItemFormService();
    return (await service.getFieldValue(CoreFieldRefNames.WorkItemType, true)) as string;
}

export async function getWorkItemProject(): Promise<string> {
    const service = await getWorkItemFormService();
    return (await service.getFieldValue(CoreFieldRefNames.TeamProject, true)) as string;
}

export async function getWorkItemField(fieldName: string): Promise<WorkItemField> {
    const service = await getWorkItemFormService();
    const fields = await service.getFields();
    const field = first(fields, (f: WorkItemField) => {
        return equals(f.name, fieldName, true) || equals(f.referenceName, fieldName, true);
    });

    if (field) {
        return field;
    } else {
        throw new Error(`Field '${fieldName}' does not exist in this work item type`);
    }
}
