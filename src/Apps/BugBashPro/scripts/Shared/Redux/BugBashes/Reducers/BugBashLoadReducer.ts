import { equals } from "azure-devops-ui/Core/Util/String";
import { LoadStatus } from "Common/Contracts";
import { resolveNullableMapKey } from "Common/Utilities/String";
import { produce } from "immer";
import { BugBashesActions, BugBashesActionTypes } from "../Actions";
import { defaultBugBashesState, IBugBashesState, IBugBashStateModel } from "../Contracts";

export function bugBashLoadReducer(state: IBugBashesState | undefined, action: BugBashesActions): IBugBashesState {
    return produce(state || defaultBugBashesState, draft => {
        switch (action.type) {
            case BugBashesActionTypes.Initialize: {
                draft.status = LoadStatus.NotLoaded;
                draft.bugBashes = undefined;
                draft.bugBashMap = undefined;
                break;
            }

            /** All bug bashes load, used by directory page */
            case BugBashesActionTypes.BeginLoadBugBashes: {
                draft.status = LoadStatus.Loading;
                draft.bugBashes = undefined;
                draft.bugBashMap = undefined;
                break;
            }

            case BugBashesActionTypes.BugBashesLoaded: {
                const bugBashes = action.payload;
                const draftBugBashMap: { [id: string]: IBugBashStateModel } = {};

                for (const bugBash of bugBashes) {
                    draftBugBashMap[resolveNullableMapKey(bugBash.id)] = {
                        status: LoadStatus.Ready,
                        bugBash: bugBash
                    };
                }

                draft.bugBashes = bugBashes;
                draft.bugBashMap = draftBugBashMap;
                draft.status = LoadStatus.Ready;
                break;
            }

            /** Single bug bash load */
            case BugBashesActionTypes.BeginLoadBugBash: {
                const bugBashId = action.payload;
                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }

                if (draft.bugBashMap[resolveNullableMapKey(bugBashId)]) {
                    draft.bugBashMap[resolveNullableMapKey(bugBashId)].status = LoadStatus.Loading;
                    draft.bugBashMap[resolveNullableMapKey(bugBashId)].error = undefined;
                } else {
                    draft.bugBashMap[resolveNullableMapKey(bugBashId)] = {
                        status: LoadStatus.Loading
                    };
                }
                break;
            }

            case BugBashesActionTypes.BugBashLoaded: {
                const bugBash = action.payload;

                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }

                draft.bugBashMap[resolveNullableMapKey(bugBash.id)] = {
                    status: LoadStatus.Ready,
                    bugBash: bugBash
                };

                if (!draft.bugBashes) {
                    draft.bugBashes = [bugBash];
                } else {
                    const index = draft.bugBashes.findIndex(b => equals(b.id!, bugBash.id!, true));
                    if (index !== -1) {
                        draft.bugBashes[index] = bugBash;
                    } else {
                        draft.bugBashes.push(bugBash);
                    }
                }

                break;
            }

            case BugBashesActionTypes.BugBashLoadFailed: {
                if (!draft.bugBashMap) {
                    draft.bugBashMap = {};
                }
                const { bugBashId, error } = action.payload;
                draft.bugBashMap[resolveNullableMapKey(bugBashId)].error = error;
                draft.bugBashMap[resolveNullableMapKey(bugBashId)].status = LoadStatus.LoadFailed;
            }
        }
    });
}
