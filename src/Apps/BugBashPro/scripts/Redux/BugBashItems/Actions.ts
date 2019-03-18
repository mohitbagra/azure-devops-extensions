import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IBugBash, IBugBashItem } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashItemsActions = {
    initialize: () => createAction(BugBashItemsActionTypes.Initialize),

    bugBashItemsLoadRequested: (bugBashId: string) => createAction(BugBashItemsActionTypes.BugBashItemsLoadRequested, bugBashId),
    beginLoadBugBashItems: () => createAction(BugBashItemsActionTypes.BeginLoadBugBashItems),
    bugBashItemsLoaded: (bugBashItems: IBugBashItem[], resolvedWorkItems: { [id: number]: WorkItem }) =>
        createAction(BugBashItemsActionTypes.BugBashItemsLoaded, { bugBashItems, resolvedWorkItems }),

    bugBashItemLoadRequested: (bugBashId: string, bugBashItemId: string) =>
        createAction(BugBashItemsActionTypes.BugBashItemLoadRequested, { bugBashId, bugBashItemId }),
    beginLoadBugBashItem: (bugBashItemId: string) => createAction(BugBashItemsActionTypes.BeginLoadBugBashItem, bugBashItemId),
    bugBashItemLoaded: (bugBashItem: IBugBashItem, resolvedWorkItem: WorkItem | undefined) =>
        createAction(BugBashItemsActionTypes.BugBashItemLoaded, { bugBashItem, resolvedWorkItem }),
    bugBashItemLoadFailed: (bugBashItemId: string, error: string) =>
        createAction(BugBashItemsActionTypes.BugBashItemLoadFailed, { bugBashItemId, error }),

    bugBashItemCreateRequested: (bugBashItem: IBugBashItem) => createAction(BugBashItemsActionTypes.BugBashItemCreateRequested, bugBashItem),
    beginCreateBugBashItem: (bugBashItem: IBugBashItem) => createAction(BugBashItemsActionTypes.BeginCreateBugBashItem, bugBashItem),
    bugBashItemCreated: (bugBashItem: IBugBashItem, resolvedWorkItem: WorkItem | undefined) =>
        createAction(BugBashItemsActionTypes.BugBashItemCreated, { bugBashItem, resolvedWorkItem }),
    bugBashItemCreateFailed: (bugBashItem: IBugBashItem, error: string) =>
        createAction(BugBashItemsActionTypes.BugBashItemCreateFailed, { bugBashItem, error }),

    bugBashItemUpdateRequested: (bugBashItem: IBugBashItem) => createAction(BugBashItemsActionTypes.BugBashItemUpdateRequested, bugBashItem),
    beginUpdateBugBashItem: (bugBashItem: IBugBashItem) => createAction(BugBashItemsActionTypes.BeginUpdateBugBashItem, bugBashItem),
    bugBashItemUpdated: (bugBashItem: IBugBashItem, resolvedWorkItem: WorkItem | undefined) =>
        createAction(BugBashItemsActionTypes.BugBashItemUpdated, { bugBashItem, resolvedWorkItem }),
    bugBashItemUpdateFailed: (bugBashItem: IBugBashItem, error: string) =>
        createAction(BugBashItemsActionTypes.BugBashItemUpdateFailed, { bugBashItem, error }),

    bugBashItemDeleteRequested: (bugBashId: string, bugBashItemId: string) =>
        createAction(BugBashItemsActionTypes.BugBashItemDeleteRequested, { bugBashId, bugBashItemId }),
    beginDeleteBugBashItem: (bugBashItemId: string) => createAction(BugBashItemsActionTypes.BeginDeleteBugBashItem, bugBashItemId),
    bugBashItemDeleted: (bugBashItemId: string) => createAction(BugBashItemsActionTypes.BugBashItemDeleted, bugBashItemId),
    bugBashItemDeleteFailed: (bugBashItemId: string, error: string) =>
        createAction(BugBashItemsActionTypes.BugBashItemDeleteFailed, { bugBashItemId, error }),

    bugBashItemAcceptRequested: (bugBash: IBugBash, bugBashItem: IBugBashItem) =>
        createAction(BugBashItemsActionTypes.BugBashItemAcceptRequested, { bugBash, bugBashItem })
};

export const enum BugBashItemsActionTypes {
    Initialize = "BugBashItemsAction/Initialize",

    BugBashItemsLoadRequested = "BugBashItemsAction/BugBashItemsLoadRequested",
    BeginLoadBugBashItems = "BugBashItemsAction/BeginLoadBugBashItems",
    BugBashItemsLoaded = "BugBashItemsAction/BugBashItemsLoaded",

    BugBashItemLoadRequested = "BugBashItemsAction/BugBashItemLoadRequested",
    BeginLoadBugBashItem = "BugBashItemsAction/BeginLoadBugBashItem",
    BugBashItemLoaded = "BugBashItemsAction/BugBashItemLoaded",
    BugBashItemLoadFailed = "BugBashItemsAction/BugBashItemLoadFailed",

    BugBashItemCreateRequested = "BugBashItemsAction/BugBashItemCreateRequested",
    BeginCreateBugBashItem = "BugBashItemsAction/BeginCreateBugBashItem",
    BugBashItemCreated = "BugBashItemsAction/BugBashItemCreated",
    BugBashItemCreateFailed = "BugBashItemsAction/BugBashItemCreateFailed",

    BugBashItemUpdateRequested = "BugBashItemsAction/BugBashItemUpdateRequested",
    BeginUpdateBugBashItem = "BugBashItemsAction/BeginUpdateBugBashItem",
    BugBashItemUpdated = "BugBashItemsAction/BugBashItemUpdated",
    BugBashItemUpdateFailed = "BugBashItemsAction/BugBashItemUpdateFailed",

    BugBashItemDeleteRequested = "BugBashItemsAction/BugBashItemDeleteRequested",
    BeginDeleteBugBashItem = "BugBashItemsAction/BeginDeleteBugBashItem",
    BugBashItemDeleted = "BugBashItemsAction/BugBashItemDeleted",
    BugBashItemDeleteFailed = "BugBashItemsAction/BugBashItemDeleteFailed",

    BugBashItemAcceptRequested = "BugBashItemsAction/BugBashItemAcceptRequested"
}

export type BugBashItemsActions = ActionsUnion<typeof BugBashItemsActions>;
