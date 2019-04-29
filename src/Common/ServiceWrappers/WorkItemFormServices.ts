import { getClient } from "azure-devops-extension-api/Common/Client";
import { CoreRestClient } from "azure-devops-extension-api/Core";
import { WorkItemField } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import * as SDK from "azure-devops-extension-sdk";
import { equals } from "azure-devops-ui/Core/Util/String";
import { CoreFieldRefNames } from "Common/Constants";
import { first } from "Common/Utilities/Array";

let workItemFormService: IWorkItemFormService;
let workItemProjectId: string;
let workItemProjectName: string;
let workItemTypeName: string;

export async function getWorkItemFormService(): Promise<IWorkItemFormService> {
    if (!workItemFormService) {
        workItemFormService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
    }

    return workItemFormService;
}

export async function getWorkItemTypeName(): Promise<string> {
    if (!workItemTypeName) {
        const service = await getWorkItemFormService();
        workItemTypeName = (await service.getFieldValue(CoreFieldRefNames.WorkItemType, true)) as string;
    }
    return workItemTypeName;
}

export async function getWorkItemProjectName(): Promise<string> {
    if (!workItemProjectName) {
        const service = await getWorkItemFormService();
        workItemProjectName = (await service.getFieldValue(CoreFieldRefNames.TeamProject, true)) as string;
    }
    return workItemProjectName;
}

export async function getWorkItemProjectId(): Promise<string> {
    if (!workItemProjectId) {
        const projectName = await getWorkItemProjectName();
        const client = await getClient(CoreRestClient);
        const project = await client.getProject(projectName);
        workItemProjectId = project.id;
    }
    return workItemProjectId;
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
