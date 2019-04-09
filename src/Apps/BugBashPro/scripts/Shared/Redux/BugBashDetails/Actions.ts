import { ILongText } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashDetailActions = {
    bugBashDetailsLoadRequested: (bugBashId: string) => createAction(BugBashDetailActionTypes.BugBashDetailsLoadRequested, bugBashId),
    beginLoadBugBashDetails: (bugBashId: string) => createAction(BugBashDetailActionTypes.BeginLoadBugBashDetails, bugBashId),
    bugBashDetailsLoaded: (bugBashId: string, details: ILongText) =>
        createAction(BugBashDetailActionTypes.BugBashDetailsLoaded, { bugBashId, details })
};

export const enum BugBashDetailActionTypes {
    BugBashDetailsLoadRequested = "BugBashDetailActions/BugBashDetailsLoadRequested",
    BeginLoadBugBashDetails = "BugBashDetailActions/BeginLoadBugBashDetails",
    BugBashDetailsLoaded = "BugBashDetailActions/BugBashDetailsLoaded"
}

export type BugBashDetailActions = ActionsUnion<typeof BugBashDetailActions>;
