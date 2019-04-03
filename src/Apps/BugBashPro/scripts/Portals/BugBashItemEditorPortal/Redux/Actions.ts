import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashItemEditorPortalActions = {
    initialize: (bugBashId: string, initialBugBashItemId: string | undefined) =>
        createAction(BugBashItemEditorPortalActionTypes.Initialize, { bugBashId, initialBugBashItemId }),

    openPortalRequested: (bugBashId: string, bugBashItemId: string, options?: { readFromCache: boolean }) =>
        createAction(BugBashItemEditorPortalActionTypes.OpenPortalRequested, {
            bugBashId,
            bugBashItemId,
            readFromCache: options ? options.readFromCache : true
        }),

    openPortal: (bugBashId: string, bugBashItemId: string | undefined, options?: { readFromCache: boolean }) =>
        createAction(BugBashItemEditorPortalActionTypes.OpenPortal, {
            bugBashId,
            bugBashItemId,
            readFromCache: options ? options.readFromCache : true
        }),

    dismissPortal: () => createAction(BugBashItemEditorPortalActionTypes.DismissPortal)
};

export const enum BugBashItemEditorPortalActionTypes {
    Initialize = "BugBashItemEditorPortalAction/Initialize",
    OpenPortal = "BugBashItemEditorPortalAction/OpenPortal",
    OpenPortalRequested = "BugBashItemEditorPortalAction/OpenPortalRequested",
    DismissPortal = "BugBashItemEditorPortalAction/DismissPortal"
}

export type BugBashItemEditorPortalActions = ActionsUnion<typeof BugBashItemEditorPortalActions>;
