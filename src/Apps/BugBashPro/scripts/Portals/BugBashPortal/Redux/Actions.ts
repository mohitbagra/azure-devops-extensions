import { ActionsUnion, createAction } from "Common/Redux";

export const BugBashPortalActions = {
    openBugBashPortal: (bugBashId: string | undefined, options?: { readFromCache: boolean }) =>
        createAction(BugBashPortalActionTypes.OpenBugBashPortal, { bugBashId, readFromCache: options ? options.readFromCache : true }),

    openBugBashItemPortal: (bugBashId: string, bugBashItemId: string | undefined, options?: { readFromCache: boolean }) =>
        createAction(BugBashPortalActionTypes.OpenBugBashItemPortal, {
            bugBashId,
            bugBashItemId,
            readFromCache: options ? options.readFromCache : true
        }),

    openSettingsPortal: () => createAction(BugBashPortalActionTypes.OpenSettingsPortal),

    dismissPortal: () => createAction(BugBashPortalActionTypes.DismissPortal)
};

export const enum BugBashPortalActionTypes {
    OpenBugBashPortal = "BugBashPortalAction/OpenBugBashPortal",
    OpenBugBashItemPortal = "BugBashPortalAction/OpenBugBashItemPortal",
    OpenSettingsPortal = "BugBashPortalAction/OpenSettingsPortal",
    DismissPortal = "BugBashPortalAction/DismissPortal"
}

export type BugBashPortalActions = ActionsUnion<typeof BugBashPortalActions>;
