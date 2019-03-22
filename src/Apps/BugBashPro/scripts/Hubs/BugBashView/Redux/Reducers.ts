import { BugBashItemsActions, BugBashItemsActionTypes } from "BugBashPro/Shared/Redux/BugBashItems";
import { readLocalSetting, writeLocalSetting } from "Common/Utilities/LocalStorageService";
import { produce } from "immer";
import { BugBashViewActions, BugBashViewActionTypes } from "./Actions";
import { BugBashViewMode, defaultBugBashViewState, IBugBashViewState } from "./Contracts";

export function bugBashViewReducer(state: IBugBashViewState | undefined, action: BugBashViewActions | BugBashItemsActions): IBugBashViewState {
    return produce(state || defaultBugBashViewState, draft => {
        switch (action.type) {
            case BugBashViewActionTypes.Initialize: {
                draft.viewMode = readLocalSetting("bugbashviewactionkey", BugBashViewMode.All) as BugBashViewMode;
                draft.filteredBugBashItems = undefined;
                draft.bugBashItemsFilterData = undefined;
                draft.filterState = undefined;
                draft.sortState = undefined;
                break;
            }

            case BugBashViewActionTypes.SetViewMode: {
                const viewMode = action.payload;
                writeLocalSetting("bugbashviewactionkey", viewMode);
                draft.viewMode = viewMode;
                break;
            }

            case BugBashViewActionTypes.SetFilteredItems: {
                draft.filteredBugBashItems = action.payload;
                break;
            }

            case BugBashViewActionTypes.ApplyFilter: {
                draft.filterState = action.payload;
                break;
            }

            case BugBashViewActionTypes.ApplySort: {
                draft.sortState = action.payload;
                break;
            }

            case BugBashViewActionTypes.ClearSortAndFilter: {
                draft.filterState = undefined;
                draft.sortState = undefined;
                break;
            }

            case BugBashViewActionTypes.SetFilterData: {
                draft.bugBashItemsFilterData = action.payload;
                break;
            }

            case BugBashItemsActionTypes.BeginLoadBugBashItems: {
                draft.filteredBugBashItems = undefined;
                draft.bugBashItemsFilterData = undefined;
            }
        }
    });
}
