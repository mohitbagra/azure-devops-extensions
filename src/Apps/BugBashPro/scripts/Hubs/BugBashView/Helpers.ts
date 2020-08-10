import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { IdentityRef } from "azure-devops-extension-api/WebApi/WebApi";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { caseInsensitiveContains, equals, localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { IBugBashItem, ISortState } from "BugBashPro/Shared/Contracts";
import {
    applyFilterAndSort,
    isBugBashItemAccepted,
    isBugBashItemPending,
    isBugBashItemRejected,
    isWorkItemFieldName
} from "BugBashPro/Shared/Helpers";
import { defaultDateComparer } from "Common/Utilities/Date";
import { getDistinctNameFromIdentityRef } from "Common/Utilities/Identity";
import { isNullOrWhiteSpace } from "Common/Utilities/String";

import { BugBashItemFieldNames, BugBashItemKeyTypes, WorkItemFieldNames } from "./Constants";
import { BugBashItemsFilterData, BugBashViewMode } from "./Redux/Contracts";

interface IBugBashItemWithWorkItem {
    bugBashItem: IBugBashItem;
    workItem?: WorkItem;
    team?: WebApiTeam;
}

export function getFilteredBugBashItems(
    allBugBashItems: IBugBashItem[] | undefined,
    resolvedWorkItems: { [id: number]: WorkItem } | undefined,
    teamsMap: { [idOrName: string]: WebApiTeam } | undefined,
    viewMode: BugBashViewMode,
    filterState?: IFilterState,
    sortState?: ISortState
): IBugBashItem[] | undefined {
    if (!allBugBashItems) {
        return undefined;
    }

    const bugBashItemsWithWorkItems: IBugBashItemWithWorkItem[] = allBugBashItems.map((b) => ({
        bugBashItem: b,
        workItem: resolvedWorkItems && b.workItemId ? resolvedWorkItems[b.workItemId] : undefined,
        team: teamsMap ? teamsMap[b.teamId] : undefined
    }));

    const filteredItems = applyFilterAndSort(bugBashItemsWithWorkItems, filterState, sortState, matcher, comparer);
    const bugBashItems = filteredItems.map((b) => b.bugBashItem);

    switch (viewMode) {
        case BugBashViewMode.Pending: {
            return bugBashItems.filter(isBugBashItemPending);
        }
        case BugBashViewMode.Rejected: {
            return bugBashItems.filter(isBugBashItemRejected);
        }
        case BugBashViewMode.Accepted: {
            return bugBashItems.filter(isBugBashItemAccepted);
        }
        default: {
            return bugBashItems;
        }
    }
}

function matcher(item: IBugBashItemWithWorkItem, filter: IFilterState): boolean {
    if (filter == null) {
        return true;
    }

    const { bugBashItem, workItem } = item;
    let returnValue = true;

    // filter by keyword : title (all items) and reject reason
    const keyword: string | undefined = filter[BugBashItemFieldNames.Title] && filter[BugBashItemFieldNames.Title]!.value;
    if (!isNullOrWhiteSpace(keyword)) {
        const title: string = workItem ? workItem.fields[WorkItemFieldNames.Title] : bugBashItem.title;
        returnValue = returnValue && caseInsensitiveContains(title, keyword || "");
    }

    // filter by teamIds: only for non accepted items
    const teamIds: string[] | undefined = filter[BugBashItemFieldNames.TeamId] && filter[BugBashItemFieldNames.TeamId]!.value;
    if (teamIds && teamIds.length > 0 && !workItem) {
        returnValue = returnValue && teamIds.filter((v) => equals(v, bugBashItem.teamId, true)).length > 0;
    }

    // filter by item created by
    const createdBys: string[] | undefined = filter[BugBashItemFieldNames.CreatedBy] && filter[BugBashItemFieldNames.CreatedBy]!.value;
    if (createdBys && createdBys.length > 0) {
        returnValue = returnValue && createdBys.filter((v) => equals(v, getDistinctNameFromIdentityRef(bugBashItem.createdBy), true)).length > 0;
    }

    // filter by rejected by: only for rejected items
    const rejectedBys: string[] | undefined = filter[BugBashItemFieldNames.RejectedBy] && filter[BugBashItemFieldNames.RejectedBy]!.value;
    if (rejectedBys && rejectedBys.length > 0 && isBugBashItemRejected(bugBashItem)) {
        returnValue = returnValue && rejectedBys.filter((v) => equals(v, getDistinctNameFromIdentityRef(bugBashItem.rejectedBy!), true)).length > 0;
    }

    // filter by work item state
    const states: string[] | undefined = filter[WorkItemFieldNames.State] && filter[WorkItemFieldNames.State]!.value;
    if (states && states.length > 0 && workItem) {
        returnValue = returnValue && states.filter((v) => equals(v, workItem.fields[WorkItemFieldNames.State], true)).length > 0;
    }

    // filter by work item assigned to
    const assignedTos: string[] | undefined = filter[WorkItemFieldNames.AssignedTo] && filter[WorkItemFieldNames.AssignedTo]!.value;
    if (assignedTos && assignedTos.length > 0 && workItem) {
        returnValue =
            returnValue &&
            assignedTos.filter((v) => equals(v, getDistinctNameFromIdentityRef(workItem.fields[WorkItemFieldNames.AssignedTo]) || "Unassigned", true))
                .length > 0;
    }

    // filter by work item area path
    const areaPaths: string[] = filter[WorkItemFieldNames.AreaPath] && filter[WorkItemFieldNames.AreaPath]!.value;
    if (areaPaths && areaPaths.length > 0 && workItem) {
        returnValue = returnValue && areaPaths.filter((v) => equals(v, workItem.fields[WorkItemFieldNames.AreaPath], true)).length > 0;
    }

    return returnValue;
}

function comparer(item1: IBugBashItemWithWorkItem, item2: IBugBashItemWithWorkItem, sortState: ISortState): number {
    const sortKey = sortState.sortKey as BugBashItemFieldNames | WorkItemFieldNames;
    const isSortedDescending = sortState.isSortedDescending;
    let compareValue = 0;
    if (sortKey === BugBashItemFieldNames.Status) {
        return 0;
    }

    const v1 = getBugBashItemProperty(item1.bugBashItem, item1.workItem, item1.team, sortKey);
    const v2 = getBugBashItemProperty(item2.bugBashItem, item2.workItem, item2.team, sortKey);

    if (v1 == null && v2 == null) {
        compareValue = 0;
    } else if (v1 == null && v2 != null) {
        compareValue = -1;
    } else if (v1 != null && v2 == null) {
        compareValue = 1;
    } else if (BugBashItemKeyTypes[sortKey] === "string") {
        compareValue = localeIgnoreCaseComparer(v1 as string, v2 as string);
    } else if (BugBashItemKeyTypes[sortKey] === "date") {
        compareValue = defaultDateComparer(v1 as Date, v2 as Date);
    } else if (BugBashItemKeyTypes[sortKey] === "boolean") {
        const b1 = !v1 ? "False" : "True";
        const b2 = !v2 ? "False" : "True";
        compareValue = localeIgnoreCaseComparer(b1, b2);
    } else if (BugBashItemKeyTypes[sortKey] === "identityRef") {
        compareValue = localeIgnoreCaseComparer((v1 as IdentityRef).displayName, (v2 as IdentityRef).displayName);
    } else if (BugBashItemKeyTypes[sortKey] === "number") {
        compareValue = (v1 as number) > (v2 as number) ? 1 : -1;
    }

    return isSortedDescending ? compareValue * -1 : compareValue;
}

function getBugBashItemProperty(
    bugBashItem: IBugBashItem,
    workItem: WorkItem | undefined,
    team: WebApiTeam | undefined,
    key: BugBashItemFieldNames | WorkItemFieldNames
): string | Date | number | boolean | IdentityRef | undefined {
    let v: string | Date | number | boolean | IdentityRef | undefined;

    if (isWorkItemFieldName(key)) {
        if (workItem) {
            v = key === WorkItemFieldNames.ID ? workItem.id : workItem.fields[key];
        }
    } else if (key === BugBashItemFieldNames.Title) {
        v = workItem ? workItem.fields[WorkItemFieldNames.Title] : bugBashItem.title;
    } else if (key === BugBashItemFieldNames.TeamId && team) {
        v = team.name;
    } else {
        v = bugBashItem[key as keyof IBugBashItem];
    }

    return v;
}

export function getBugBashItemsFilterData(
    bugBashItems: IBugBashItem[] | undefined,
    workItemsMap: { [id: number]: WorkItem } | undefined
): BugBashItemsFilterData {
    const filterData: BugBashItemsFilterData = {
        [BugBashItemFieldNames.TeamId]: {},
        [BugBashItemFieldNames.CreatedBy]: {},
        [BugBashItemFieldNames.RejectedBy]: {},
        [WorkItemFieldNames.AreaPath]: {},
        [WorkItemFieldNames.AssignedTo]: {},
        [WorkItemFieldNames.State]: {}
    };

    if (!bugBashItems) {
        return undefined;
    }

    for (const bugBashItem of bugBashItems) {
        const createdBy = bugBashItem.createdBy;
        const createdByStr = getDistinctNameFromIdentityRef(createdBy);
        filterData[BugBashItemFieldNames.CreatedBy][createdByStr] = (filterData[BugBashItemFieldNames.CreatedBy][createdByStr] || 0) + 1;

        if (!isBugBashItemAccepted(bugBashItem)) {
            const teamId = bugBashItem.teamId;
            filterData[BugBashItemFieldNames.TeamId][teamId] = (filterData[BugBashItemFieldNames.TeamId][teamId] || 0) + 1;

            if (isBugBashItemRejected(bugBashItem)) {
                const rejectedBy = bugBashItem.rejectedBy;
                const rejectedByStr = getDistinctNameFromIdentityRef(rejectedBy!);
                filterData[BugBashItemFieldNames.RejectedBy][rejectedByStr] = (filterData[BugBashItemFieldNames.RejectedBy][rejectedByStr] || 0) + 1;
            }
        } else {
            const workItem = workItemsMap && bugBashItem.workItemId ? workItemsMap[bugBashItem.workItemId] : undefined;
            if (workItem) {
                const areaPath = workItem.fields[WorkItemFieldNames.AreaPath];
                const assignedTo = getDistinctNameFromIdentityRef(workItem.fields[WorkItemFieldNames.AssignedTo]) || "Unassigned";
                const state = workItem.fields[WorkItemFieldNames.State];

                filterData[WorkItemFieldNames.AreaPath][areaPath] = (filterData[WorkItemFieldNames.AreaPath][areaPath] || 0) + 1;
                filterData[WorkItemFieldNames.State][state] = (filterData[WorkItemFieldNames.State][state] || 0) + 1;
                filterData[WorkItemFieldNames.AssignedTo][assignedTo] = (filterData[WorkItemFieldNames.AssignedTo][assignedTo] || 0) + 1;
            }
        }
    }

    return filterData;
}
