import { equals } from "azure-devops-ui/Core/Util/String";
import { LoadStatus } from "Common/Contracts";
import { resolveNullableMapKey } from "Common/Utilities/String";
import { produce } from "immer";
import { BugBashesActions, BugBashesActionTypes } from "../Actions";
import { defaultBugBashesState, IBugBashesState } from "../Contracts";

export function bugBashUpdateReducer(state: IBugBashesState | undefined, action: BugBashesActions): IBugBashesState {
    return produce(state || defaultBugBashesState, draft => {
        switch (action.type) {
            /** Bug bash create and update */
            case BugBashesActionTypes.BeginUpdateBugBash: {
                const bugBash = action.payload;
                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }
                draft.bugBashMap[resolveNullableMapKey(bugBash.id)].error = undefined;
                draft.bugBashMap[resolveNullableMapKey(bugBash.id)].status = LoadStatus.Updating;
                break;
            }

            case BugBashesActionTypes.BeginDeleteBugBash: {
                const bugBashId = action.payload;
                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }
                draft.bugBashMap[resolveNullableMapKey(bugBashId)].error = undefined;
                draft.bugBashMap[resolveNullableMapKey(bugBashId)].status = LoadStatus.Updating;
                break;
            }

            case BugBashesActionTypes.BugBashCreated:
            case BugBashesActionTypes.BugBashUpdated: {
                const bugBash = action.payload;
                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }

                if (draft.bugBashes) {
                    const index = draft.bugBashes.findIndex(b => equals(b.id!, bugBash.id!, true));
                    if (index !== -1) {
                        draft.bugBashes[index] = bugBash;
                    } else {
                        draft.bugBashes.push(bugBash);
                    }
                } else {
                    draft.bugBashes = [bugBash];
                }

                draft.bugBashMap[resolveNullableMapKey(bugBash.id)] = {
                    status: LoadStatus.Ready,
                    bugBash: bugBash
                };
                break;
            }

            case BugBashesActionTypes.BugBashUpdateFailed: {
                const { bugBash, error } = action.payload;
                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }

                draft.bugBashMap[resolveNullableMapKey(bugBash.id)].error = error;
                draft.bugBashMap[resolveNullableMapKey(bugBash.id)].status = LoadStatus.UpdateFailed;
                break;
            }

            case BugBashesActionTypes.BugBashDeleteFailed: {
                const { bugBashId, error } = action.payload;
                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }

                draft.bugBashMap[resolveNullableMapKey(bugBashId)].error = error;
                draft.bugBashMap[resolveNullableMapKey(bugBashId)].status = LoadStatus.UpdateFailed;
                break;
            }

            case BugBashesActionTypes.BugBashDeleted: {
                const bugBashId = action.payload;
                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }

                if (draft.bugBashes) {
                    draft.bugBashes = draft.bugBashes.filter(b => !equals(b.id!, bugBashId, true));
                } else {
                    draft.bugBashes = [];
                }

                delete draft.bugBashMap[resolveNullableMapKey(bugBashId)];
            }
        }
    });
}
