import { ILongText } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashDetailActions = {
    bugBashDetailsLoadRequested: (bugBashId: string) => createAction(BugBashDetailActionTypes.BugBashDetailsLoadRequested, bugBashId),
    beginLoadBugBashDetails: (bugBashId: string) => createAction(BugBashDetailActionTypes.BeginLoadBugBashDetails, bugBashId),
    bugBashDetailsLoaded: (bugBashId: string, details: ILongText) =>
        createAction(BugBashDetailActionTypes.BugBashDetailsLoaded, { bugBashId, details }),

    BugBashDetailsUpdateRequested: (bugBashId: string, bugBashDetails: ILongText) =>
        createAction(BugBashDetailActionTypes.BugBashDetailsUpdateRequested, { bugBashId, bugBashDetails }),
    beginUpdateBugBashDetails: (bugBashId: string, bugBashDetails: ILongText) =>
        createAction(BugBashDetailActionTypes.BeginUpdateBugBashDetails, { bugBashId, bugBashDetails }),
    BugBashDetailsUpdated: (bugBashId: string, bugBashDetails: ILongText) =>
        createAction(BugBashDetailActionTypes.BugBashDetailsUpdated, { bugBashId, bugBashDetails }),
    BugBashDetailsUpdateFailed: (bugBashId: string, bugBashDetails: ILongText, error: string) =>
        createAction(BugBashDetailActionTypes.BugBashDetailsUpdateFailed, { bugBashId, bugBashDetails, error })
};

export const enum BugBashDetailActionTypes {
    BugBashDetailsLoadRequested = "BugBashDetailActions/BugBashDetailsLoadRequested",
    BeginLoadBugBashDetails = "BugBashDetailActions/BeginLoadBugBashDetails",
    BugBashDetailsLoaded = "BugBashDetailActions/BugBashDetailsLoaded",

    BugBashDetailsUpdateRequested = "BugBashDetailActions/BugBashDetailsUpdateRequested",
    BeginUpdateBugBashDetails = "BugBashDetailActions/BeginUpdateBugBashDetails",
    BugBashDetailsUpdated = "BugBashDetailActions/BugBashDetailsUpdated",
    BugBashDetailsUpdateFailed = "BugBashDetailActions/BugBashDetailsUpdateFailed"
}

export type BugBashDetailActions = ActionsUnion<typeof BugBashDetailActions>;
