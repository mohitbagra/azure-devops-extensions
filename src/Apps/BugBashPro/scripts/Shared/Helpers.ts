import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { getCurrentUser } from "Common/Utilities/Identity";
import { IBugBash, IBugBashItem, ISortState } from "./Contracts";

export function resolveNullableMapKey(key: string | undefined): string {
    return (key || "").toLowerCase();
}

export function applyFilterAndSort<T>(
    items: T[],
    filterState: IFilterState | undefined,
    sortState: ISortState | undefined,
    matcher: (item: T, filterState: IFilterState | undefined) => boolean,
    comparer: (item1: T, item2: T, sortState: ISortState | undefined) => number
): T[] {
    let filteredItems = [...items];
    if (filterState) {
        filteredItems = filteredItems.filter(b => matcher(b, filterState));
    }

    if (sortState) {
        filteredItems.sort((b1, b2) => comparer(b1, b2, sortState));
    }

    return filteredItems;
}

export function getNewBugBashInstance(): IBugBash {
    return {
        title: "",
        workItemType: "",
        projectId: "",
        itemDescriptionField: "",
        autoAccept: false
    };
}

export function getNewBugBashItemInstance(bugBashId: string, teamId?: string): IBugBashItem {
    return {
        bugBashId: bugBashId,
        title: "",
        description: "",
        teamId: teamId,
        createdBy: getCurrentUser(),
        rejected: false,
        rejectReason: ""
    } as IBugBashItem;
}
