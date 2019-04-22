import { LoadStatus } from "Common/Contracts";
import { resolveNullableMapKey } from "Common/Utilities/String";
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

            case BugBashDetailActionTypes.BeginUpdateBugBashDetails: {
                const { bugBashId, bugBashDetails } = action.payload;

                draft.detailsMap[resolveNullableMapKey(bugBashId)].error = undefined;
                draft.detailsMap[resolveNullableMapKey(bugBashId)].status = LoadStatus.Updating;
                draft.detailsMap[resolveNullableMapKey(bugBashId)].details = bugBashDetails;
                break;
            }

            case BugBashDetailActionTypes.BugBashDetailsUpdateFailed: {
                const { bugBashId, bugBashDetails, error } = action.payload;
                draft.detailsMap[resolveNullableMapKey(bugBashId)].error = error;
                draft.detailsMap[resolveNullableMapKey(bugBashId)].status = LoadStatus.UpdateFailed;
                draft.detailsMap[resolveNullableMapKey(bugBashId)].details = bugBashDetails;
                break;
            }

            case BugBashDetailActionTypes.BugBashDetailsUpdated: {
                const { bugBashId, bugBashDetails } = action.payload;
                draft.detailsMap[resolveNullableMapKey(bugBashId)].error = undefined;
                draft.detailsMap[resolveNullableMapKey(bugBashId)].status = LoadStatus.Ready;
                draft.detailsMap[resolveNullableMapKey(bugBashId)].details = bugBashDetails;
            }
        }
    });
}
