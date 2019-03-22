import { equals } from "azure-devops-ui/Core/Util/String";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import {
    createDocument, deleteDocument, readDocument, readDocuments, updateDocument
} from "Common/ServiceWrappers/ExtensionDataManager";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export async function fetchBugBashesAsync(): Promise<IBugBash[]> {
    let bugBashModels = await readDocuments<IBugBash>(getCollectionKey(), false);

    const projectId = await getCurrentProjectId();
    bugBashModels = bugBashModels.filter(b => equals(projectId, b.projectId, true));

    for (const bugBashModel of bugBashModels) {
        preProcessBugBash(bugBashModel);
    }

    return bugBashModels;
}

export async function fetchBugBashAsync(bugBashId: string): Promise<IBugBash> {
    const bugBashModel = await readDocument<IBugBash>(getCollectionKey(), bugBashId, undefined, false);
    const projectId = await getCurrentProjectId();
    if (bugBashModel && equals(bugBashModel.projectId, projectId, true)) {
        preProcessBugBash(bugBashModel);
        return bugBashModel;
    } else {
        throw new Error(`Bug Bash "${bugBashId}" does not exist or it belongs to a different project.`);
    }
}

export async function createBugBashAsync(bugBash: IBugBash): Promise<IBugBash> {
    try {
        const projectId = await getCurrentProjectId();
        const createdBugBash = await createDocument<IBugBash>(getCollectionKey(), { ...bugBash, projectId: projectId }, false);
        preProcessBugBash(createdBugBash);

        return createdBugBash;
    } catch (e) {
        throw new Error(`Cannot create bug bash. Reason: ${e.message}`);
    }
}

export async function updateBugBashAsync(bugBash: IBugBash): Promise<IBugBash> {
    try {
        const updatedBugBash = await updateDocument<IBugBash>(getCollectionKey(), bugBash, false);
        preProcessBugBash(updatedBugBash);

        return updatedBugBash;
    } catch (e) {
        throw new Error(
            "This bug bash instance has been modified by some one else. Please refresh the instance to get the latest version and try updating it again."
        );
    }
}

export async function deleteBugBashAsync(bugBashId: string): Promise<void> {
    try {
        await deleteDocument(getCollectionKey(), bugBashId, false);
    } catch (e) {
        throw new Error(`Cannot delete bug bash. Reason: ${e.message}`);
    }
}

function getCollectionKey(): string {
    return "bugbashes";
}

function preProcessBugBash(bugBash: IBugBash) {
    if (typeof bugBash.startTime === "string") {
        if (isNullOrWhiteSpace(bugBash.startTime as string)) {
            bugBash.startTime = undefined;
        } else {
            bugBash.startTime = new Date(bugBash.startTime);
        }
    }
    if (typeof bugBash.endTime === "string") {
        if (isNullOrWhiteSpace(bugBash.endTime as string)) {
            bugBash.endTime = undefined;
        } else {
            bugBash.endTime = new Date(bugBash.endTime);
        }
    }

    // convert old format of accept template to new one
    if ((bugBash as any)["acceptTemplate"] != null) {
        bugBash.acceptTemplateId = (bugBash as any)["acceptTemplate"].templateId;
        bugBash.acceptTemplateTeam = (bugBash as any)["acceptTemplate"].team;

        delete (bugBash as any)["acceptTemplate"];
    }

    if ((bugBash as any)["description"] != null) {
        delete (bugBash as any)["description"];
    }
}
