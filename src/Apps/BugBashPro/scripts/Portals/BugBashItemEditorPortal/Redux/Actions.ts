import { IBugBash, IBugBashItem } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashItemEditorPortalActions = {
    openPortal: (bugBash: IBugBash, bugBashItem: IBugBashItem | undefined) =>
        createAction(BugBashItemEditorPortalActionTypes.OpenPortal, { bugBash, bugBashItem }),
    dismissPortal: () => createAction(BugBashItemEditorPortalActionTypes.DismissPortal)
};

export const enum BugBashItemEditorPortalActionTypes {
    OpenPortal = "BugBashItemEditorPortalAction/OpenPortal",
    DismissPortal = "BugBashItemEditorPortalAction/DismissPortal"
}

export type BugBashItemEditorPortalActions = ActionsUnion<typeof BugBashItemEditorPortalActions>;
