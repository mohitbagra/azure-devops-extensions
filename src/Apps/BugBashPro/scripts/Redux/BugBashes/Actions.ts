import { IBugBash } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashesActions = {
    initialize: () => createAction(BugBashesActionTypes.Initialize),

    bugBashesLoadRequested: () => createAction(BugBashesActionTypes.BugBashesLoadRequested),
    beginLoadBugBashes: () => createAction(BugBashesActionTypes.BeginLoadBugBashes),
    bugBashesLoaded: (bugBashes: IBugBash[]) => createAction(BugBashesActionTypes.BugBashesLoaded, bugBashes),

    bugBashLoadRequested: (bugBashId: string) => createAction(BugBashesActionTypes.BugBashLoadRequested, bugBashId),
    beginLoadBugBash: (bugBashId: string) => createAction(BugBashesActionTypes.BeginLoadBugBash, bugBashId),
    bugBashLoaded: (bugBash: IBugBash) => createAction(BugBashesActionTypes.BugBashLoaded, bugBash),
    bugBashLoadFailed: (bugBashId: string, error: string) => createAction(BugBashesActionTypes.BugBashLoadFailed, { bugBashId, error }),

    bugBashCreateRequested: (bugBash: IBugBash) => createAction(BugBashesActionTypes.BugBashCreateRequested, bugBash),
    beginCreateBugBash: (bugBash: IBugBash) => createAction(BugBashesActionTypes.BeginCreateBugBash, bugBash),
    bugBashCreated: (bugBash: IBugBash) => createAction(BugBashesActionTypes.BugBashCreated, bugBash),
    bugBashCreateFailed: (bugBash: IBugBash, error: string) => createAction(BugBashesActionTypes.BugBashCreateFailed, { bugBash, error }),

    bugBashUpdateRequested: (bugBash: IBugBash) => createAction(BugBashesActionTypes.BugBashUpdateRequested, bugBash),
    beginUpdateBugBash: (bugBash: IBugBash) => createAction(BugBashesActionTypes.BeginUpdateBugBash, bugBash),
    bugBashUpdated: (bugBash: IBugBash) => createAction(BugBashesActionTypes.BugBashUpdated, bugBash),
    bugBashUpdateFailed: (bugBash: IBugBash, error: string) => createAction(BugBashesActionTypes.BugBashUpdateFailed, { bugBash, error }),

    bugBashDeleteRequested: (bugBashId: string) => createAction(BugBashesActionTypes.BugBashDeleteRequested, bugBashId),
    beginDeleteBugBash: (bugBashId: string) => createAction(BugBashesActionTypes.BeginDeleteBugBash, bugBashId),
    bugBashDeleted: (bugBashId: string) => createAction(BugBashesActionTypes.BugBashDeleted, bugBashId),
    bugBashDeleteFailed: (bugBashId: string, error: string) => createAction(BugBashesActionTypes.BugBashDeleteFailed, { bugBashId, error })
};

export const enum BugBashesActionTypes {
    Initialize = "BugBashesAction/Initialize",

    BugBashesLoadRequested = "BugBashesAction/BugBashesLoadRequested",
    BeginLoadBugBashes = "BugBashesAction/BeginLoadBugBashes",
    BugBashesLoaded = "BugBashesAction/BugBashesLoaded",

    BugBashLoadRequested = "BugBashesAction/BugBashLoadRequested",
    BeginLoadBugBash = "BugBashesAction/BeginLoadBugBash",
    BugBashLoaded = "BugBashesAction/BugBashLoaded",
    BugBashLoadFailed = "BugBashesAction/BugBashLoadFailed",

    BugBashCreateRequested = "BugBashesAction/BugBashCreateRequested",
    BeginCreateBugBash = "BugBashesAction/BeginCreateBugBash",
    BugBashCreated = "BugBashesAction/BugBashCreated",
    BugBashCreateFailed = "BugBashesAction/BugBashCreateFailed",

    BugBashUpdateRequested = "BugBashesAction/BugBashUpdateRequested",
    BeginUpdateBugBash = "BugBashesAction/BeginUpdateBugBash",
    BugBashUpdated = "BugBashesAction/BugBashUpdated",
    BugBashUpdateFailed = "BugBashesAction/BugBashUpdateFailed",

    BugBashDeleteRequested = "BugBashesAction/BugBashDeleteRequested",
    BeginDeleteBugBash = "BugBashesAction/BeginDeleteBugBash",
    BugBashDeleted = "BugBashesAction/BugBashDeleted",
    BugBashDeleteFailed = "BugBashesAction/BugBashDeleteFailed"
}

export type BugBashesActions = ActionsUnion<typeof BugBashesActions>;
