import { IBugBash } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const BugBashItemEditorPortalActions = {
    openPortal: (bugBash: IBugBash, bugBashItemId?: string) =>
        createAction(BugBashItemEditorPortalActionTypes.OpenPortal, { bugBash, bugBashItemId }),
    dismissPortal: () => createAction(BugBashItemEditorPortalActionTypes.DismissPortal)
};

export const enum BugBashItemEditorPortalActionTypes {
    OpenPortal = "BugBashItemEditorPortalAction/OpenPortal",
    DismissPortal = "BugBashItemEditorPortalAction/DismissPortal"
}

export type BugBashItemEditorPortalActions = ActionsUnion<typeof BugBashItemEditorPortalActions>;
