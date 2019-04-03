import { ActionsUnion, createAction } from "Common/Redux";
import { IBugBashEditPortalProps, IBugBashItemEditPortalProps, PortalType } from "./Contracts";

export const BugBashPortalActions = {
    openPortal: (portalType: PortalType, portalProps: IBugBashEditPortalProps | IBugBashItemEditPortalProps | undefined) =>
        createAction(BugBashPortalActionTypes.OpenPortal, { portalType, portalProps }),
    dismissPortal: () => createAction(BugBashPortalActionTypes.DismissPortal)
};

export const enum BugBashPortalActionTypes {
    OpenPortal = "BugBashPortalAction/OpenPortal",
    DismissPortal = "BugBashPortalAction/DismissPortal"
}

export type BugBashPortalActions = ActionsUnion<typeof BugBashPortalActions>;
