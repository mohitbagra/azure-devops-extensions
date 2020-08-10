import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { defaultDateComparer } from "Common/Utilities/Date";

import { IBugBash, IBugBashItem, ISortState } from "./Contracts";

export function applyFilterAndSort<T>(
    items: T[],
    filterState: IFilterState | undefined,
    sortState: ISortState | undefined,
    matcher: (item: T, filterState: IFilterState | undefined) => boolean,
    comparer: (item1: T, item2: T, sortState: ISortState | undefined) => number
): T[] {
    let filteredItems = [...items];
    if (filterState) {
        filteredItems = filteredItems.filter((b) => matcher(b, filterState));
    }

    if (sortState) {
        filteredItems.sort((b1, b2) => comparer(b1, b2, sortState));
    }

    return filteredItems;
}

export function isBugBashCompleted(bugBash: IBugBash, currentTime: Date): boolean {
    const endTime = bugBash.endTime;
    return endTime != null && defaultDateComparer(endTime, currentTime) < 0;
}

export function isBugBashScheduled(bugBash: IBugBash, currentTime: Date): boolean {
    const startTime = bugBash.startTime;
    return startTime != null && defaultDateComparer(startTime, currentTime) > 0;
}

export function isBugBashInProgress(bugBash: IBugBash, currentTime: Date): boolean {
    const startTime = bugBash.startTime;
    const endTime = bugBash.endTime;

    if (!startTime && !endTime) {
        return true;
    } else if (!startTime && endTime) {
        return defaultDateComparer(endTime, currentTime) >= 0;
    } else if (startTime && !endTime) {
        return defaultDateComparer(startTime, currentTime) <= 0;
    } else {
        return defaultDateComparer(startTime, currentTime) <= 0 && defaultDateComparer(endTime, currentTime) >= 0;
    }
}

export function isBugBashItemPending(bugBashItem: IBugBashItem): boolean {
    return !isBugBashItemAccepted(bugBashItem) && !isBugBashItemRejected(bugBashItem);
}

export function isBugBashItemRejected(bugBashItem: IBugBashItem): boolean {
    return !isBugBashItemAccepted(bugBashItem) && !!bugBashItem.rejected;
}

export function isBugBashItemAccepted(bugBashItem: IBugBashItem): boolean {
    const { workItemId } = bugBashItem;
    return workItemId != null && workItemId > 0;
}

export function isWorkItemFieldName(field: string) {
    return field.indexOf("System.") === 0;
}
