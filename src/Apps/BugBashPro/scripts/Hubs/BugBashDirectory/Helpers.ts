import { caseInsensitiveContains, localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { IBugBash, ISortState } from "BugBashPro/Shared/Contracts";
import { applyFilterAndSort, isBugBashCompleted, isBugBashInProgress, isBugBashScheduled } from "BugBashPro/Shared/Helpers";
import { defaultDateComparer } from "Common/Utilities/Date";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { BugBashFieldNames, BugBashKeyTypes } from "./Constants";
import { BugBashDirectoryTabId, IBugBashCounts } from "./Redux/Contracts";

export function getFilteredBugBashes(
    allBugBashes: IBugBash[] | undefined,
    selectedTab: BugBashDirectoryTabId,
    filterState?: IFilterState,
    sortState?: ISortState
): { filteredBugBashes: IBugBash[] | undefined; counts: IBugBashCounts | undefined } {
    if (!allBugBashes) {
        return { filteredBugBashes: undefined, counts: undefined };
    }

    const currentTime = new Date();
    const filteredAllBugBashes = applyFilterAndSort(allBugBashes, filterState, undefined, matcher, comparer);
    const pastBugBashes = filteredAllBugBashes.filter(b => isBugBashCompleted(b, currentTime));
    const ongoingBugBashes = filteredAllBugBashes.filter(b => isBugBashInProgress(b, currentTime));
    const upcomingBugBashes = filteredAllBugBashes.filter(b => isBugBashScheduled(b, currentTime));

    const counts: IBugBashCounts = {
        past: pastBugBashes ? pastBugBashes.length : 0,
        ongoing: ongoingBugBashes ? ongoingBugBashes.length : 0,
        upcoming: upcomingBugBashes ? upcomingBugBashes.length : 0
    };
    let filteredBugBashes: IBugBash[];
    let defaultSortState: ISortState;

    switch (selectedTab) {
        case BugBashDirectoryTabId.Past: {
            filteredBugBashes = pastBugBashes;
            defaultSortState = { sortKey: BugBashFieldNames.EndTime, isSortedDescending: true };
            break;
        }
        case BugBashDirectoryTabId.Ongoing: {
            filteredBugBashes = ongoingBugBashes;
            defaultSortState = { sortKey: BugBashFieldNames.StartTime, isSortedDescending: true };
            break;
        }
        default: {
            filteredBugBashes = upcomingBugBashes;
            defaultSortState = { sortKey: BugBashFieldNames.StartTime, isSortedDescending: false };
        }
    }

    filteredBugBashes.sort((b1, b2) => comparer(b1, b2, sortState || defaultSortState));

    return {
        filteredBugBashes: filteredBugBashes,
        counts: counts
    };
}

function matcher(bugBash: IBugBash, filter: IFilterState): boolean {
    if (!filter || !filter[BugBashFieldNames.Title] || isNullOrWhiteSpace(filter[BugBashFieldNames.Title]!.value)) {
        return true;
    }

    return caseInsensitiveContains(bugBash.title, filter[BugBashFieldNames.Title]!.value);
}

function comparer(bugBash1: IBugBash, bugBash2: IBugBash, sortState: ISortState): number {
    const sortKey = sortState.sortKey as keyof IBugBash;
    const isSortedDescending = sortState.isSortedDescending;
    let compareValue = 0;

    if (BugBashKeyTypes[sortKey] === "string") {
        const v1 = bugBash1[sortKey] as string;
        const v2 = bugBash2[sortKey] as string;
        compareValue = localeIgnoreCaseComparer(v1, v2);
    } else if (BugBashKeyTypes[sortKey] === "date") {
        const v1 = bugBash1[sortKey] as Date;
        const v2 = bugBash2[sortKey] as Date;
        compareValue = defaultDateComparer(v1, v2);
    }

    return isSortedDescending ? compareValue * -1 : compareValue;
}
