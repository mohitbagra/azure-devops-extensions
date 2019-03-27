import { IBugBash, IBugBashItem } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashItemEditorPortalActions = {
    initialize: (initialBugBashItemId: string | undefined) => createAction(BugBashItemEditorPortalActionTypes.Initialize, initialBugBashItemId),
    openPortal: (bugBash: IBugBash, bugBashItem: IBugBashItem | undefined, options: { readFromCache: boolean }) =>
        createAction(BugBashItemEditorPortalActionTypes.OpenPortal, { bugBash, bugBashItem, readFromCache: options.readFromCache }),
    dismissPortal: () => createAction(BugBashItemEditorPortalActionTypes.DismissPortal)
};

export const enum BugBashItemEditorPortalActionTypes {
    Initialize = "BugBashItemEditorPortalAction/Initialize",
    OpenPortal = "BugBashItemEditorPortalAction/OpenPortal",
    DismissPortal = "BugBashItemEditorPortalAction/DismissPortal"
}

export type BugBashItemEditorPortalActions = ActionsUnion<typeof BugBashItemEditorPortalActions>;
