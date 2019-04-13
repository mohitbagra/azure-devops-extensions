import { IdentityRef } from "azure-devops-extension-api/WebApi/WebApi";
import { isGuid } from "azure-devops-ui/Core/Util/String";
import { IBugBashItemComment } from "BugBashPro/Shared/Contracts";
import { createDocument, readDocuments } from "Common/ServiceWrappers/ExtensionDataManager";
import { defaultDateComparer } from "Common/Utilities/Date";
import { getCurrentUser, parseUniquefiedIdentityName } from "Common/Utilities/Identity";
import { memoizePromise } from "Common/Utilities/Memoize";
import { isNullOrWhiteSpace } from "Common/Utilities/String";

export const fetchCommentsAsync = memoizePromise(
    async (bugBashItemId: string) => {
        const comments = await readDocuments<IBugBashItemComment>(getCollectionKey(bugBashItemId), false);
        for (const comment of comments) {
            preProcessModel(comment);
        }

        comments.sort((c1, c2) => {
            const v1 = c1.createdDate;
            const v2 = c2.createdDate;

            if (v1 == null && v2 == null) {
                return 0;
            } else if (v1 == null && v2 != null) {
                return -1;
            } else if (v1 != null && v2 == null) {
                return 1;
            } else {
                return defaultDateComparer(v1, v2);
            }
        });
        return comments;
    },
    (bugBashItemId: string) => `fetchComments_${bugBashItemId}`
);

export async function createCommentAsync(bugBashItemId: string, commentText: string): Promise<IBugBashItemComment> {
    try {
        const comment: IBugBashItemComment = {
            createdBy: getCurrentUser(),
            createdDate: new Date(Date.now()),
            content: commentText
        };

        const savedComment = await createDocument<IBugBashItemComment>(getCollectionKey(bugBashItemId), comment, false);
        preProcessModel(savedComment);

        return savedComment;
    } catch (e) {
        throw new Error(`Cannot create comment. Reason: ${e.message}`);
    }
}

function getCollectionKey(bugBashItemId: string): string {
    return isGuid(bugBashItemId) ? `Comments_${bugBashItemId}` : `BugBashItemCollection_${bugBashItemId}`;
}

function preProcessModel(bugBashItemComment: IBugBashItemComment) {
    if (typeof bugBashItemComment.createdDate === "string") {
        if (isNullOrWhiteSpace(bugBashItemComment.createdDate as string)) {
            (bugBashItemComment as any).createdDate = undefined;
        } else {
            bugBashItemComment.createdDate = new Date(bugBashItemComment.createdDate);
        }
    }

    // back-compat -  If created by is uniquefied string, parse it into identityref object
    if (typeof bugBashItemComment.createdBy === "string") {
        bugBashItemComment.createdBy = parseUniquefiedIdentityName(bugBashItemComment.createdBy) as IdentityRef;
    }
}
