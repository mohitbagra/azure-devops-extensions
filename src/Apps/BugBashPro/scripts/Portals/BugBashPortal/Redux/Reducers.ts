import { produce } from "immer";
import { BugBashPortalActions, BugBashPortalActionTypes } from "./Actions";
import { defaultBugBashPortalState, IBugBashPortalState, PortalType } from "./Contracts";

export function portalReducer(state: IBugBashPortalState | undefined, action: BugBashPortalActions): IBugBashPortalState {
    return produce(state || defaultBugBashPortalState, draft => {
        switch (action.type) {
            case BugBashPortalActionTypes.OpenBugBashPortal: {
                const { bugBashId, readFromCache } = action.payload;
                draft.portalOpen = true;
                draft.portalProps = { bugBashId, readFromCache };
                draft.portalType = PortalType.BugBashEdit;
                break;
            }

            case BugBashPortalActionTypes.OpenBugBashItemPortal: {
                const { bugBashId, bugBashItemId, readFromCache } = action.payload;
                draft.portalOpen = true;
                draft.portalProps = { bugBashId, bugBashItemId, readFromCache };
                draft.portalType = PortalType.BugBashItemEdit;
                break;
            }

            case BugBashPortalActionTypes.OpenSettingsPortal: {
                draft.portalOpen = true;
                draft.portalProps = undefined;
                draft.portalType = PortalType.SettingsEdit;
                break;
            }

            case BugBashPortalActionTypes.OpenDetailsPortal: {
                const bugBashId = action.payload;
                draft.portalOpen = true;
                draft.portalProps = { bugBashId };
                draft.portalType = PortalType.DetailsEdit;
                break;
            }

            case BugBashPortalActionTypes.DismissPortal: {
                draft.portalOpen = false;
                draft.portalProps = undefined;
                draft.portalType = undefined;
            }
        }
    });
}
