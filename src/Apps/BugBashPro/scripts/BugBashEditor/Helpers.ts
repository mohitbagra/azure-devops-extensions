import { FieldType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { equals } from "azure-devops-ui/Core/Util/String";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { IFieldAwareState } from "Common/Redux/Fields/Contracts";
import { getField, getWorkItemTypeField } from "Common/Redux/Fields/Selectors";
import { ITeamAwareState } from "Common/Redux/Teams/Contracts";
import { getTeam } from "Common/Redux/Teams/Selectors";
import { IWorkItemTemplateAwareState } from "Common/Redux/WorkItemTemplates/Contracts";
import { getTeamTemplate } from "Common/Redux/WorkItemTemplates/Selectors";
import { IWorkItemTypeAwareState } from "Common/Redux/WorkItemTypes/Contracts";
import { getWorkItemType } from "Common/Redux/WorkItemTypes/Selectors";
import { defaultDateComparer } from "Common/Utilities/Date";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { TitleFieldMaxLength } from "./Constants";

export function isBugBashValid(
    state: ITeamAwareState & IFieldAwareState & IWorkItemTypeAwareState & IWorkItemTemplateAwareState,
    bugBash: IBugBash
): boolean {
    const { title, workItemType, itemDescriptionField, startTime, endTime, defaultTeam, acceptTemplateTeam, acceptTemplateId } = bugBash;

    return (
        isTitleValid(title) &&
        areDatesValid(startTime, endTime) &&
        isWorkItemTypeValid(state, workItemType) &&
        isDescriptionFieldValid(state, workItemType, itemDescriptionField) &&
        isTeamValid(state, defaultTeam) &&
        isTeamValid(state, acceptTemplateTeam) &&
        isTemplateValid(state, acceptTemplateTeam, acceptTemplateId)
    );
}

export function isBugBashDirty(originalBugBash: IBugBash, updatedBugBash: IBugBash): boolean {
    const {
        title = "",
        workItemType = "",
        itemDescriptionField = "",
        startTime,
        endTime,
        defaultTeam = "",
        acceptTemplateTeam = "",
        acceptTemplateId = "",
        autoAccept
    } = updatedBugBash;
    const {
        title: orig_title = "",
        workItemType: orig_workItemType = "",
        itemDescriptionField: orig_itemDescriptionField = "",
        startTime: orig_startTime,
        endTime: orig_endTime,
        defaultTeam: orig_defaultTeam = "",
        acceptTemplateTeam: orig_acceptTemplateTeam = "",
        acceptTemplateId: orig_acceptTemplateId = "",
        autoAccept: orig_autoAccept
    } = originalBugBash;

    return (
        !equals(title, orig_title) ||
        !equals(workItemType, orig_workItemType, true) ||
        defaultDateComparer(startTime, orig_startTime) !== 0 ||
        defaultDateComparer(endTime, orig_endTime) !== 0 ||
        !equals(itemDescriptionField, orig_itemDescriptionField, true) ||
        autoAccept !== orig_autoAccept ||
        !equals(defaultTeam, orig_defaultTeam, true) ||
        !equals(acceptTemplateTeam, orig_acceptTemplateTeam, true) ||
        !equals(acceptTemplateId, orig_acceptTemplateId, true)
    );
}

function isTitleValid(title: string): boolean {
    return !isNullOrWhiteSpace(title) && title.length <= TitleFieldMaxLength;
}

function areDatesValid(startTime: Date | undefined, endTime: Date | undefined): boolean {
    return !startTime || !endTime || defaultDateComparer(startTime, endTime) < 0;
}

function isWorkItemTypeValid(state: IWorkItemTypeAwareState, workItemTypeName: string): boolean {
    return !isNullOrWhiteSpace(workItemTypeName) && getWorkItemType(state, workItemTypeName) !== undefined;
}

function isDescriptionFieldValid(state: IFieldAwareState, workItemTypeName: string, fieldRefName: string): boolean {
    const field = getField(state, fieldRefName);
    const workItemTypeField = getWorkItemTypeField(state, workItemTypeName, fieldRefName);
    return !isNullOrWhiteSpace(fieldRefName) && field !== undefined && workItemTypeField !== undefined && field.type === FieldType.Html;
}

function isTeamValid(state: ITeamAwareState, teamId: string | undefined): boolean {
    return !teamId || getTeam(state, teamId) !== undefined;
}

function isTemplateValid(state: IWorkItemTemplateAwareState, teamId: string | undefined, templateId: string | undefined): boolean {
    return !teamId || !templateId || getTeamTemplate(state, teamId, templateId) !== undefined;
}
