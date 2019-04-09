import { ILongText } from "BugBashPro/Shared/Contracts";
import { addOrUpdateDocument, readDocument } from "Common/ServiceWrappers/ExtensionDataManager";

export async function fetchBugBashDetailsAsync(bugBashId: string): Promise<ILongText> {
    const details = await readDocument<ILongText>(getCollectionKey(), bugBashId, { id: bugBashId, text: "" }, false);
    return details as ILongText;
}

export async function addOrUpdateDetailsAsync(details: ILongText): Promise<ILongText> {
    try {
        return await addOrUpdateDocument<ILongText>(getCollectionKey(), details, false);
    } catch (e) {
        throw new Error(
            "This text has been modified by some one else. Please refresh the instance to get the latest version and try updating it again."
        );
    }
}

function getCollectionKey(): string {
    return "longtexts";
}
