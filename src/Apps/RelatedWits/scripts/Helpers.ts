import { IdentityRef } from "azure-devops-extension-api/WebApi/WebApi";
import { WorkItem, WorkItemField } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { caseInsensitiveContains, equals, localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { CoreFieldRefNames } from "Common/Constants";
import { getWorkItemFormService } from "Common/ServiceWrappers/WorkItemFormServices";
import { getDistinctNameFromIdentityRef } from "Common/Utilities/Identity";
import { isNullOrWhiteSpace } from "Common/Utilities/String";

import { DEFAULT_FIELDS_TO_RETRIEVE, ExcludedFields, KeyTypes } from "./Constants";
import { ISortState } from "./Interfaces";

// tslint:disable-next-line:cyclomatic-complexity
export function workItemMatchesFilter(workItem: WorkItem, filterState?: IFilterState): boolean {
    if (!filterState) {
        return true;
    }

    let returnValue = true;

    // filter by keyword : title (all items) and reject reason
    const keyword: string | undefined = filterState.keyword && filterState.keyword.value;
    if (!isNullOrWhiteSpace(keyword)) {
        const title: string = workItem.fields[CoreFieldRefNames.Title];
        returnValue = returnValue && caseInsensitiveContains(title, keyword || "");
    }

    // filter by work item state
    const states: string[] = filterState[CoreFieldRefNames.State] && filterState[CoreFieldRefNames.State]!.value;
    if (states && states.length > 0) {
        returnValue = returnValue && states.filter((v) => equals(v, workItem.fields[CoreFieldRefNames.State], true)).length > 0;
    }

    // filter by work item assigned to
    const assignedTos: string[] | undefined = filterState[CoreFieldRefNames.AssignedTo] && filterState[CoreFieldRefNames.AssignedTo]!.value;
    if (assignedTos && assignedTos.length > 0) {
        returnValue =
            returnValue &&
            assignedTos.filter((v) => equals(v, getDistinctNameFromIdentityRef(workItem.fields[CoreFieldRefNames.AssignedTo]) || "Unassigned", true))
                .length > 0;
    }

    // filter by work item area path
    const areaPaths: string[] = filterState[CoreFieldRefNames.AreaPath] && filterState[CoreFieldRefNames.AreaPath]!.value;
    if (areaPaths && areaPaths.length > 0) {
        returnValue = returnValue && areaPaths.filter((v) => equals(v, workItem.fields[CoreFieldRefNames.AreaPath], true)).length > 0;
    }

    // filter by work item area path
    const workItemTypes: string[] = filterState[CoreFieldRefNames.WorkItemType] && filterState[CoreFieldRefNames.WorkItemType]!.value;
    if (workItemTypes && workItemTypes.length > 0) {
        returnValue = returnValue && workItemTypes.filter((v) => equals(v, workItem.fields[CoreFieldRefNames.WorkItemType], true)).length > 0;
    }

    return returnValue;
}

export function workItemComparer(workItem1: WorkItem, workItem2: WorkItem, sortState: ISortState): number {
    const sortKey = sortState.sortKey;
    const isSortedDescending = sortState.isSortedDescending;
    let compareValue = 0;

    const v1: string | IdentityRef | number = sortKey === CoreFieldRefNames.Id ? workItem1.id : workItem1.fields[sortKey];
    const v2: string | IdentityRef | number = sortKey === CoreFieldRefNames.Id ? workItem2.id : workItem2.fields[sortKey];

    if (v1 == null && v2 == null) {
        compareValue = 0;
    } else if (v1 == null && v2 != null) {
        compareValue = -1;
    } else if (v1 != null && v2 == null) {
        compareValue = 1;
    } else if (KeyTypes[sortKey] === "string") {
        compareValue = localeIgnoreCaseComparer(v1 as string, v2 as string);
    } else if (KeyTypes[sortKey] === "identityRef") {
        compareValue = localeIgnoreCaseComparer((v1 as IdentityRef).displayName, (v2 as IdentityRef).displayName);
    } else if (KeyTypes[sortKey] === "number") {
        compareValue = v1 > v2 ? 1 : -1;
    }

    return isSortedDescending ? compareValue * -1 : compareValue;
}

export function fieldNameComparer(a: WorkItemField, b: WorkItemField): number {
    const aUpper = a.name.toUpperCase();
    const bUpper = b.name.toUpperCase();

    if (aUpper < bUpper) {
        return -1;
    }
    if (aUpper > bUpper) {
        return 1;
    }
    return 0;
}

export function applyFilterAndSort(workItems: WorkItem[] | undefined, filterState?: IFilterState, sortState?: ISortState): WorkItem[] | undefined {
    if (!workItems) {
        return undefined;
    }

    let filteredItems = [...workItems];
    if (filterState) {
        filteredItems = filteredItems.filter((w) => workItemMatchesFilter(w, filterState));
    }

    if (sortState) {
        filteredItems.sort((w1, w2) => workItemComparer(w1, w2, sortState));
    }

    return filteredItems;
}

export async function createQuery(project: string, fieldsToSeek: string[], sortByField: string): Promise<string> {
    const workItemFormService = await getWorkItemFormService();
    const fieldValues = await workItemFormService.getFieldValues(fieldsToSeek, true);
    const witId = await workItemFormService.getId();

    // Generate fields to retrieve part
    const fieldsToRetrieveString = DEFAULT_FIELDS_TO_RETRIEVE.map((fieldRefName) => `[${fieldRefName}]`).join(",");

    // Generate fields to seek part
    const fieldsToSeekString = fieldsToSeek
        .map((fieldRefName) => {
            const fieldValue = fieldValues[fieldRefName] == null ? "" : fieldValues[fieldRefName];
            if (equals(fieldRefName, "System.Tags", true)) {
                if (fieldValue) {
                    const tagStr = fieldValue
                        .toString()
                        .split(";")
                        .map((v) => {
                            return `[System.Tags] CONTAINS '${v}'`;
                        })
                        .join(" OR ");

                    return `(${tagStr})`;
                }
            } else if (ExcludedFields.indexOf(fieldRefName) === -1) {
                if (fieldValue !== "" && fieldValue != null) {
                    if (equals(typeof fieldValue, "string", true)) {
                        return `[${fieldRefName}] = '${fieldValue}'`;
                    } else {
                        return `[${fieldRefName}] = ${fieldValue}`;
                    }
                }
            }

            return null;
        })
        .filter((e) => e != null)
        .join(" AND ");

    const fieldsToSeekPredicate = fieldsToSeekString ? `AND ${fieldsToSeekString}` : "";
    return `SELECT ${fieldsToRetrieveString} FROM WorkItems
        where [System.TeamProject] = '${project}' AND [System.ID] <> ${witId}
        ${fieldsToSeekPredicate} order by [${sortByField}] desc`;
}
