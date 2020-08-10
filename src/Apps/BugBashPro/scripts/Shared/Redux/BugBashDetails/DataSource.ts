import { ILongText } from "BugBashPro/Shared/Contracts";
import { addOrUpdateDocument, readDocument } from "Common/ServiceWrappers/ExtensionDataManager";
import { memoizePromise } from "Common/Utilities/Memoize";

export const fetchBugBashDetailsAsync = memoizePromise(
    async (bugBashId: string) => {
        const details = await readDocument<ILongText>(getCollectionKey(), bugBashId, { id: bugBashId, text: "" }, false);
        return details as ILongText;
    },
    (bugBashId: string) => `fetchBugBashDetails_${bugBashId}`
);

export const addOrUpdateBugBashDetailsAsync = memoizePromise(
    async (details: ILongText) => {
        try {
            return await addOrUpdateDocument<ILongText>(getCollectionKey(), details, false);
        } catch (e) {
            throw new Error(
                "This text has been modified by some one else. Please refresh the instance to get the latest version and try updating it again."
            );
        }
    },
    (details: ILongText) => `addOrUpdateBugBashDetails_${details.id}`
);

function getCollectionKey(): string {
    return "longtexts";
}
