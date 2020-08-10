import { getClient } from "azure-devops-extension-api/Common/Client";
import { IdentityRef, JsonPatchDocument, JsonPatchOperation, Operation } from "azure-devops-extension-api/WebApi/WebApi";
import { WorkItem, WorkItemErrorPolicy, WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking";
import { isGuid } from "azure-devops-ui/Core/Util/String";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { CoreFieldRefNames } from "Common/Constants";
import { createDocument, deleteDocument, readDocument, readDocuments, updateDocument } from "Common/ServiceWrappers/ExtensionDataManager";
import { parseUniquefiedIdentityName } from "Common/Utilities/Identity";
import { memoizePromise } from "Common/Utilities/Memoize";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchBugBashItemsAsync = memoizePromise(
    async (bugBashId: string) => {
        const bugBashItemModels = await readDocuments<IBugBashItem>(getCollectionKey(bugBashId), false);
        for (const bugBashItemModel of bugBashItemModels) {
            preProcessBugBashItem(bugBashItemModel);
        }

        return bugBashItemModels;
    },
    (bugBashId: string) => `fetchBugBashItems_${bugBashId}`
);

export const fetchBugBashItemAsync = memoizePromise(
    async (bugBashId: string, bugBashItemId: string) => {
        const bugBashItemModel = await readDocument<IBugBashItem>(getCollectionKey(bugBashId), bugBashItemId, undefined, false);
        if (bugBashItemModel) {
            preProcessBugBashItem(bugBashItemModel);
            return bugBashItemModel;
        } else {
            throw new Error(`Bug Bash Item "${bugBashItemId}" does not exist.`);
        }
    },
    (bugBashId: string, bugBashItemId: string) => `fetchBugBashItem_${bugBashId}_${bugBashItemId}`
);

export const updateBugBashItemAsync = memoizePromise(
    async (bugBashId: string, bugBashItem: IBugBashItem) => {
        try {
            const updatedBugBashItem = await updateDocument<IBugBashItem>(getCollectionKey(bugBashId), bugBashItem, false);
            preProcessBugBashItem(updatedBugBashItem);
            return updatedBugBashItem;
        } catch (e) {
            throw new Error(
                "This bug bash item has been modified by some one else. Please refresh the item to get the latest version and try updating it again."
            );
        }
    },
    (bugBashId: string, bugBashItem: IBugBashItem) => `updateBugBashItem_${bugBashId}_${bugBashItem.id}`
);

export const deleteBugBashItemAsync = memoizePromise(
    async (bugBashId: string, bugBashItemId: string) => {
        try {
            await deleteDocument(getCollectionKey(bugBashId), bugBashItemId, false);
        } catch (e) {
            throw new Error(`Cannot delete bug bash item. Reason: ${e.message}`);
        }
    },
    (bugBashId: string, bugBashItemId: string) => `deleteBugBashItem_${bugBashId}_${bugBashItemId}`
);

export async function createBugBashItemAsync(bugBashId: string, bugBashItem: IBugBashItem): Promise<IBugBashItem> {
    try {
        const createdBugBashItem = await createDocument<IBugBashItem>(
            getCollectionKey(bugBashId),
            { ...bugBashItem, createdDate: new Date() },
            false
        );
        preProcessBugBashItem(createdBugBashItem);
        return createdBugBashItem;
    } catch (e) {
        throw new Error(`Cannot create bug bash item. Reason: ${e.message}`);
    }
}

export async function createWorkItemAsync(workItemType: string, fieldValues: { [fieldRefName: string]: string }): Promise<WorkItem> {
    const patchDocument: JsonPatchDocument & JsonPatchOperation[] = [];
    for (const fieldRefName of Object.keys(fieldValues)) {
        patchDocument.push({
            op: Operation.Add,
            path: `/fields/${fieldRefName}`,
            value: fieldValues[fieldRefName]
        } as JsonPatchOperation);
    }

    const client = await getClient(WorkItemTrackingRestClient);
    const projectId = await getCurrentProjectId();
    return client.createWorkItem(patchDocument, projectId, workItemType);
}

export async function getWorkItemsAsync(ids: number[]): Promise<WorkItem[]> {
    const client = await getClient(WorkItemTrackingRestClient);
    const project = await getCurrentProjectId();
    const cloneIds = [...ids];
    const idsToFetch: number[][] = [];
    let i = 0;
    while (cloneIds.length > 0) {
        idsToFetch[i] = cloneIds.splice(0, 100);
        i++;
    }

    const fieldsToLoad = [
        CoreFieldRefNames.Id,
        CoreFieldRefNames.Title,
        CoreFieldRefNames.WorkItemType,
        CoreFieldRefNames.State,
        CoreFieldRefNames.AssignedTo,
        CoreFieldRefNames.AreaPath
    ];

    const promises = idsToFetch.map(async (witIds) =>
        client.getWorkItems(witIds, project, fieldsToLoad, undefined, undefined, WorkItemErrorPolicy.Omit)
    );
    const workItemArrays: WorkItem[][] = await Promise.all(promises);
    const finalResult: WorkItem[] = [];
    for (const workItemArray of workItemArrays) {
        finalResult.push(...workItemArray);
    }

    return filterNullWorkItems(finalResult, ids);
}

function filterNullWorkItems(workItems: WorkItem[], idsToFetch: number[]): WorkItem[] {
    const workItemsMap: { [id: number]: WorkItem } = {};
    for (const workItem of workItems) {
        if (workItem) {
            workItemsMap[workItem.id] = workItem;
        }
    }

    const filteredWorkItems: WorkItem[] = [];
    for (const witId of idsToFetch) {
        if (workItemsMap[witId]) {
            filteredWorkItems.push(workItemsMap[witId]);
        }
    }

    return filteredWorkItems;
}

function getCollectionKey(bugBashId: string): string {
    return isGuid(bugBashId) ? `Items_${bugBashId}` : `BugBashCollection_${bugBashId}`;
}

function preProcessBugBashItem(bugBashItem: IBugBashItem) {
    if (typeof bugBashItem.createdDate === "string") {
        if (isNullOrWhiteSpace(bugBashItem.createdDate)) {
            (bugBashItem as any).createdDate = undefined;
        } else {
            bugBashItem.createdDate = new Date(bugBashItem.createdDate);
        }
    }

    // back-compat -  If created by is uniquefied string, parse it into identityref object
    if (typeof bugBashItem.rejectedBy === "string") {
        if (isNullOrWhiteSpace(bugBashItem.rejectedBy)) {
            bugBashItem.rejectedBy = undefined;
        } else {
            bugBashItem.rejectedBy = parseUniquefiedIdentityName(bugBashItem.rejectedBy);
        }
    }
    if (typeof bugBashItem.createdBy === "string") {
        if (isNullOrWhiteSpace(bugBashItem.createdBy)) {
            (bugBashItem as any).createdBy = undefined;
        } else {
            bugBashItem.createdBy = parseUniquefiedIdentityName(bugBashItem.createdBy) as IdentityRef;
        }
    }

    bugBashItem.teamId = bugBashItem.teamId || "";
}
