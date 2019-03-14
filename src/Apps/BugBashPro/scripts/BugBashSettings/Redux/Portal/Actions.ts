import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const BugBashSettingsPortalActions = {
    openPortal: () => createAction(BugBashSettingsPortalActionTypes.OpenPortal),
    dismissPortal: () => createAction(BugBashSettingsPortalActionTypes.DismissPortal)
};

export const enum BugBashSettingsPortalActionTypes {
    OpenPortal = "BugBashSettingsPortalAction/OpenPortal",
    DismissPortal = "BugBashSettingsPortalAction/DismissPortal"
}

export type BugBashSettingsPortalActions = ActionsUnion<typeof BugBashSettingsPortalActions>;
