import { getClient } from "azure-devops-extension-api/Common/Client";
import {
    JsonPatchDocument, JsonPatchOperation, Operation
} from "azure-devops-extension-api/WebApi/WebApi";
import {
    WorkItemTrackingRestClient, WorkItemType
} from "azure-devops-extension-api/WorkItemTracking";
import * as SDK from "azure-devops-extension-sdk";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { reloadPage } from "Common/ServiceWrappers/HostNavigationService";
import { getWorkItemFormNavigationService } from "Common/ServiceWrappers/WorkItemNavigationService";
import { getCurrentProjectId } from "Common/Utilities/WebContext";
import * as Q from "q";

interface IContributedMenuItem {
    id?: string;
    key?: string;
    text?: string;
    name?: string;
    title?: string;
    separator?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    icon?: string;
    noIcon?: boolean;
    childItems?: IContributedMenuItem[] | Promise<IContributedMenuItem[]>;
    groupId?: string;
    href?: string;
    action?: (actionContext: any) => void;
    ariaLabel?: string;
}

SDK.register("pr-workitems-menu", () => {
    return {
        getMenuItems: (actionContext: any) => {
            if (actionContext && actionContext.pullRequest && actionContext.pullRequest.artifactId) {
                const deferred = Q.defer<IContributedMenuItem[]>();
                getChildItems(actionContext.pullRequest.artifactId).then(items => deferred.resolve(items));

                return [
                    {
                        text: "Link to a new workitem",
                        title: "Create a new workitem and link to this Pull request",
                        icon: "images/logo.png",
                        childItems: deferred.promise
                    }
                ];
            }
        }
    };
});

SDK.init();

let workItemTypes: WorkItemType[];

async function getChildItems(artifactId: string): Promise<IContributedMenuItem[]> {
    const projectId = await getCurrentProjectId();
    const witClient = await getClient(WorkItemTrackingRestClient);

    if (!workItemTypes) {
        workItemTypes = await witClient.getWorkItemTypes(projectId);
        workItemTypes.sort((a: WorkItemType, b: WorkItemType) => localeIgnoreCaseComparer(a.name, b.name));
    }

    return workItemTypes.map(w => ({
        text: w.name,
        title: w.name,
        action: async () => {
            const workItemNavSvc = await getWorkItemFormNavigationService();
            const workItem = await workItemNavSvc.openNewWorkItem(w.name);
            if (workItem && workItem.id) {
                const patchDocument: JsonPatchDocument & JsonPatchOperation[] = [
                    {
                        op: Operation.Add,
                        path: "/relations/-",
                        value: {
                            rel: "ArtifactLink",
                            url: artifactId,
                            attributes: {
                                name: "Pull Request"
                            }
                        }
                    } as JsonPatchOperation
                ];
                try {
                    await witClient.updateWorkItem(patchDocument, workItem.id);
                    reloadPage();
                } catch (e) {
                    console.warn(`Cannot create workitem: ${e.message}`);
                }
            }
        }
    }));
}
