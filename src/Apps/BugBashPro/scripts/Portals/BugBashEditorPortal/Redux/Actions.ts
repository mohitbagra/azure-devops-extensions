import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashEditorPortalActions = {
    openPortal: (bugBashId: string | undefined, options?: { readFromCache: boolean }) =>
        createAction(BugBashEditorPortalActionTypes.OpenPortal, { bugBashId, readFromCache: options ? options.readFromCache : true }),

    dismissPortal: () => createAction(BugBashEditorPortalActionTypes.DismissPortal)
};

export const enum BugBashEditorPortalActionTypes {
    OpenPortal = "BugBashEditorPortalAction/OpenPortal",
    DismissPortal = "BugBashEditorPortalAction/DismissPortal"
}

export type BugBashEditorPortalActions = ActionsUnion<typeof BugBashEditorPortalActions>;
