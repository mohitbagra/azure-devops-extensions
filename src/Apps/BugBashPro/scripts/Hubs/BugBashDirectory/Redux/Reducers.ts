import { BugBashesActions, BugBashesActionTypes } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { readLocalSetting, writeLocalSetting } from "Common/Utilities/LocalStorageService";
import { produce } from "immer";
import { getFilteredBugBashes } from "../Helpers";
import { BugBashDirectoryActions, BugBashDirectoryActionTypes } from "./Actions";
import { BugBashDirectoryTabId, defaultBugBashDirectoryState, IBugBashDirectoryState } from "./Contracts";

export function bugBashDirectoryReducer(
    state: IBugBashDirectoryState | undefined,
    action: BugBashDirectoryActions | BugBashesActions
): IBugBashDirectoryState {
    return produce(state || defaultBugBashDirectoryState, draft => {
        switch (action.type) {
            case BugBashDirectoryActionTypes.Initialize: {
                draft.selectedTabId = readLocalSetting("directorypivotkey", BugBashDirectoryTabId.Ongoing) as BugBashDirectoryTabId;
                draft.filteredBugBashes = undefined;
                draft.bugBashCounts = undefined;
                draft.filterState = undefined;
                draft.sortState = undefined;
                break;
            }

            case BugBashDirectoryActionTypes.SelectTab: {
                const tabId = action.payload;
                writeLocalSetting("directorypivotkey", tabId);
                draft.selectedTabId = tabId;
                break;
            }

            case BugBashDirectoryActionTypes.SetFilteredItems: {
                const { filteredBugBashes, bugBashCounts } = action.payload;
                draft.filteredBugBashes = filteredBugBashes;
                draft.bugBashCounts = bugBashCounts;
                break;
            }

            case BugBashDirectoryActionTypes.ApplyFilter: {
                draft.filterState = action.payload;
                break;
            }

            case BugBashDirectoryActionTypes.ApplySort: {
                draft.sortState = action.payload;
                break;
            }

            case BugBashDirectoryActionTypes.ClearSortAndFilter: {
                draft.filterState = undefined;
                draft.sortState = undefined;
                break;
            }

            case BugBashesActionTypes.BeginLoadBugBashes: {
                draft.filteredBugBashes = undefined;
                draft.bugBashCounts = undefined;
                break;
            }

            case BugBashesActionTypes.BugBashesLoaded: {
                const bugBashes = action.payload;
                const { filteredBugBashes, counts } = getFilteredBugBashes(bugBashes, draft.selectedTabId, draft.filterState, draft.sortState);

                draft.filteredBugBashes = filteredBugBashes;
                draft.bugBashCounts = counts;
            }
        }
    });
}
