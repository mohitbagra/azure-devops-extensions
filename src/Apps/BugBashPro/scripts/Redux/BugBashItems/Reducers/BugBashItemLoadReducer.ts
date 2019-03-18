import { equals } from "azure-devops-ui/Core/Util/String";
import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { BugBashItemsActions, BugBashItemsActionTypes } from "../Actions";
import { defaultBugBashItemsState, IBugBashItemsState, IBugBashItemStateModel } from "../Contracts";

export function bugBashItemLoadReducer(state: IBugBashItemsState | undefined, action: BugBashItemsActions): IBugBashItemsState {
    return produce(state || defaultBugBashItemsState, draft => {
        switch (action.type) {
            case BugBashItemsActionTypes.Initialize: {
                draft.status = LoadStatus.NotLoaded;
                draft.bugBashItems = undefined;
                draft.bugBashItemMap = undefined;
                draft.resolvedWorkItemsMap = undefined;
                break;
            }

            /** All bug bashes load, used by bug bash view page */
            case BugBashItemsActionTypes.BeginLoadBugBashItems: {
                draft.status = LoadStatus.Loading;
                draft.bugBashItems = undefined;
                draft.bugBashItemMap = undefined;
                draft.resolvedWorkItemsMap = undefined;
                break;
            }

            case BugBashItemsActionTypes.BugBashItemsLoaded: {
                const { bugBashItems, resolvedWorkItems } = action.payload;

                const draftBugBashItemsMap: { [id: string]: IBugBashItemStateModel } = {};
                for (const bugBashItem of bugBashItems) {
                    draftBugBashItemsMap[resolveNullableMapKey(bugBashItem.id)] = {
                        status: LoadStatus.Ready,
                        bugBashItem: bugBashItem
                    };
                }
                draft.bugBashItems = bugBashItems;
                draft.resolvedWorkItemsMap = resolvedWorkItems;
                draft.bugBashItemMap = draftBugBashItemsMap;
                draft.status = LoadStatus.Ready;
                break;
            }

            /** Single bug bash load, used by item view page */
            case BugBashItemsActionTypes.BeginLoadBugBashItem: {
                const bugBashItemId = action.payload;
                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }

                if (draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)]) {
                    draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)].status = LoadStatus.Loading;
                    draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)].error = undefined;
                } else {
                    draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)] = {
                        status: LoadStatus.Loading
                    };
                }
                break;
            }

            case BugBashItemsActionTypes.BugBashItemLoaded: {
                const { bugBashItem, resolvedWorkItem } = action.payload;

                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }

                draft.bugBashItemMap[resolveNullableMapKey(bugBashItem.id)] = {
                    status: LoadStatus.Ready,
                    bugBashItem: bugBashItem
                };

                if (!draft.bugBashItems) {
                    draft.bugBashItems = [bugBashItem];
                } else {
                    const index = draft.bugBashItems.findIndex(b => equals(b.id!, bugBashItem.id!, true));
                    if (index !== -1) {
                        draft.bugBashItems[index] = bugBashItem;
                    } else {
                        draft.bugBashItems.push(bugBashItem);
                    }
                }

                if (resolvedWorkItem) {
                    if (!draft.resolvedWorkItemsMap) {
                        draft.resolvedWorkItemsMap = {};
                    }

                    draft.resolvedWorkItemsMap[resolvedWorkItem.id] = resolvedWorkItem;
                }
                break;
            }

            case BugBashItemsActionTypes.BugBashItemLoadFailed: {
                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }
                const { bugBashItemId, error } = action.payload;
                draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)].error = error;
                draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)].status = LoadStatus.LoadFailed;
            }
        }
    });
}
