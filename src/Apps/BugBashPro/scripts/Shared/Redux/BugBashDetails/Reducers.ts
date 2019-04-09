import { resolveNullableMapKey } from "BugBashPro/Shared/Helpers";
import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { BugBashDetailActions, BugBashDetailActionTypes } from "./Actions";
import { defaultState, IBugBashDetailsState } from "./Contracts";

export function bugBashDetailsReducer(state: IBugBashDetailsState | undefined, action: BugBashDetailActions): IBugBashDetailsState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case BugBashDetailActionTypes.BeginLoadBugBashDetails: {
                const bugBashId = action.payload;
                draft.detailsMap[resolveNullableMapKey(bugBashId)] = {
                    status: LoadStatus.Loading
                };
                break;
            }

            case BugBashDetailActionTypes.BugBashDetailsLoaded: {
                const { bugBashId, details } = action.payload;
                draft.detailsMap[resolveNullableMapKey(bugBashId)] = {
                    status: LoadStatus.Ready,
                    details: details
                };
                break;
            }
        }
    });
}
