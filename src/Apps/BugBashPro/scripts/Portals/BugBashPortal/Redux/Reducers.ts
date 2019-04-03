import { produce } from "immer";
import { BugBashPortalActions, BugBashPortalActionTypes } from "./Actions";
import { defaultBugBashPortalState, IBugBashPortalState } from "./Contracts";

export function portalReducer(state: IBugBashPortalState | undefined, action: BugBashPortalActions): IBugBashPortalState {
    return produce(state || defaultBugBashPortalState, draft => {
        switch (action.type) {
            case BugBashPortalActionTypes.OpenPortal: {
                const { portalProps, portalType } = action.payload;
                draft.portalOpen = true;
                draft.portalProps = portalProps;
                draft.portalType = portalType;
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
