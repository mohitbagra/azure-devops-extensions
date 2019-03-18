import { getClient } from "azure-devops-extension-api";
import {
    WorkItemRelationType, WorkItemTrackingRestClient
} from "azure-devops-extension-api/WorkItemTracking";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { memoizePromise } from "Common/Utilities/Memoize";

export const fetchWorkItemRelationTypes = memoizePromise(
    async () => {
        const workItemRelationTypes = await getClient(WorkItemTrackingRestClient).getRelationTypes();
        workItemRelationTypes.sort((a: WorkItemRelationType, b: WorkItemRelationType) => localeIgnoreCaseComparer(a.name, b.name));
        return workItemRelationTypes;
    },
    () => "workItemRelationTypes"
);
