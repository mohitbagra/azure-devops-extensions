import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashEditorPortalActions = {
    openPortal: (bugBashId?: string) => createAction(BugBashEditorPortalActionTypes.OpenPortal, bugBashId),
    dismissPortal: () => createAction(BugBashEditorPortalActionTypes.DismissPortal)
};

export const enum BugBashEditorPortalActionTypes {
    OpenPortal = "BugBashEditorPortalAction/OpenPortal",
    DismissPortal = "BugBashEditorPortalAction/DismissPortal"
}

export type BugBashEditorPortalActions = ActionsUnion<typeof BugBashEditorPortalActions>;
