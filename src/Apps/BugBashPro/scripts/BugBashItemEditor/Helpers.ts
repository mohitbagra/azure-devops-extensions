import { equals } from "azure-devops-ui/Core/Util/String";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { TitleFieldMaxLength } from "./Constants";

export function isBugBashItemValid(bugBashItem: IBugBashItem): boolean {
    const { title } = bugBashItem;

    return isTitleValid(title);
}

export function isBugBashItemDirty(originalBugBashItem: IBugBashItem, updatedBugBashItem: IBugBashItem): boolean {
    const { title = "", teamId = "", description = "", rejectReason = "", rejected } = updatedBugBashItem;
    const {
        title: orig_title = "",
        teamId: orig_teamId = "",
        description: orig_description = "",
        rejectReason: orig_rejectReason = "",
        rejected: orig_rejected
    } = originalBugBashItem;

    return (
        !equals(title, orig_title) ||
        !equals(teamId, orig_teamId, true) ||
        !equals(description, orig_description, true) ||
        rejected !== orig_rejected ||
        !equals(rejectReason, orig_rejectReason, true)
    );
}

function isTitleValid(title: string): boolean {
    return !isNullOrWhiteSpace(title) && title.length <= TitleFieldMaxLength;
}
