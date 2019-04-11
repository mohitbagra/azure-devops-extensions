import { getClient } from "azure-devops-extension-api/Common/Client";
import { WorkItemField, WorkItemTrackingRestClient, WorkItemTypeFieldsExpandLevel } from "azure-devops-extension-api/WorkItemTracking";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export async function fetchFields() {
    const projectId = await getCurrentProjectId();
    const fields = await getClient(WorkItemTrackingRestClient).getFields(projectId);
    fields.sort((a: WorkItemField, b: WorkItemField) => localeIgnoreCaseComparer(a.name, b.name));
    return fields;
}

export const fetchWorkItemTypeFields = memoizePromise(
    async (workItemTypeName: string) => {
        const projectId = await getCurrentProjectId();
        return getClient(WorkItemTrackingRestClient).getWorkItemTypeFieldsWithReferences(
            projectId,
            workItemTypeName,
            WorkItemTypeFieldsExpandLevel.AllowedValues
        );
    },
    (workItemTypeName: string) => workItemTypeName.toLowerCase()
);
