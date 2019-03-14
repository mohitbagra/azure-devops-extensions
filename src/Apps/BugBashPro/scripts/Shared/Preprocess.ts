import { IdentityRef } from "azure-devops-extension-api/WebApi/WebApi";
import { parseUniquefiedIdentityName } from "Common/Utilities/Identity";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { IBugBash, IBugBashItem } from "./Contracts";

export function preProcessBugBash(bugBash: IBugBash) {
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

export function preProcessBugBashItem(bugBashItem: IBugBashItem) {
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
