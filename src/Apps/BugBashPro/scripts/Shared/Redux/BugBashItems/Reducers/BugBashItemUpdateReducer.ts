import { equals } from "azure-devops-ui/Core/Util/String";
import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { BugBashItemsActions, BugBashItemsActionTypes } from "../Actions";
import { defaultBugBashItemsState, IBugBashItemsState } from "../Contracts";

export function bugBashItemUpdateReducer(state: IBugBashItemsState | undefined, action: BugBashItemsActions): IBugBashItemsState {
    return produce(state || defaultBugBashItemsState, draft => {
        switch (action.type) {
            /** Bug bash create and update */
            case BugBashItemsActionTypes.BeginUpdateBugBashItem: {
                const bugBashItem = action.payload;
                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }
                draft.bugBashItemMap[resolveNullableMapKey(bugBashItem.id)].error = undefined;
                draft.bugBashItemMap[resolveNullableMapKey(bugBashItem.id)].status = LoadStatus.Updating;
                break;
            }

            case BugBashItemsActionTypes.BeginDeleteBugBashItem: {
                const bugBashItemId = action.payload;
                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }
                draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)].error = undefined;
                draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)].status = LoadStatus.Updating;
                break;
            }

            case BugBashItemsActionTypes.BugBashItemCreated:
            case BugBashItemsActionTypes.BugBashItemUpdated: {
                const { bugBashItem, resolvedWorkItem } = action.payload;
                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }

                if (draft.bugBashItems) {
                    const index = draft.bugBashItems.findIndex(b => equals(b.id!, bugBashItem.id!, true));
                    if (index !== -1) {
                        draft.bugBashItems[index] = bugBashItem;
                    } else {
                        draft.bugBashItems.push(bugBashItem);
                    }
                } else {
                    draft.bugBashItems = [bugBashItem];
                }

                draft.bugBashItemMap[resolveNullableMapKey(bugBashItem.id)] = {
                    status: LoadStatus.Ready,
                    bugBashItem: bugBashItem
                };

                if (resolvedWorkItem) {
                    if (!draft.resolvedWorkItemsMap) {
                        draft.resolvedWorkItemsMap = {};
                    }

                    draft.resolvedWorkItemsMap[resolvedWorkItem.id] = resolvedWorkItem;
                }
                break;
            }

            case BugBashItemsActionTypes.BugBashItemUpdateFailed: {
                const { bugBashItem, error } = action.payload;
                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }

                draft.bugBashItemMap[resolveNullableMapKey(bugBashItem.id)].error = error;
                draft.bugBashItemMap[resolveNullableMapKey(bugBashItem.id)].status = LoadStatus.UpdateFailed;
                break;
            }

            case BugBashItemsActionTypes.BugBashItemDeleteFailed: {
                const { bugBashItemId, error } = action.payload;
                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }

                draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)].error = error;
                draft.bugBashItemMap[resolveNullableMapKey(bugBashItemId)].status = LoadStatus.UpdateFailed;
                break;
            }

            case BugBashItemsActionTypes.BugBashItemDeleted: {
                const bugBashId = action.payload;
                if (!draft.bugBashItemMap) {
                    draft.bugBashItemMap = {};
                }

                if (draft.bugBashItems) {
                    draft.bugBashItems = draft.bugBashItems.filter(b => !equals(b.id!, bugBashId, true));
                } else {
                    draft.bugBashItems = [];
                }

                delete draft.bugBashItemMap[resolveNullableMapKey(bugBashId)];
            }
        }
    });
}
