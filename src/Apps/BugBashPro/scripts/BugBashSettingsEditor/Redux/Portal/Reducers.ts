import { produce } from "immer";
import { BugBashSettingsPortalActions, BugBashSettingsPortalActionTypes } from "./Actions";
import { defaultBugBashSettingsPortalState, IBugBashSettingsPortalState } from "./Contracts";

export function settingsPortalReducer(
    state: IBugBashSettingsPortalState | undefined,
    action: BugBashSettingsPortalActions
): IBugBashSettingsPortalState {
    return produce(state || defaultBugBashSettingsPortalState, draft => {
        switch (action.type) {
            case BugBashSettingsPortalActionTypes.OpenPortal: {
                draft.portalOpen = true;
                break;
            }

            case BugBashSettingsPortalActionTypes.DismissPortal: {
                draft.portalOpen = false;
            }
        }
    });
}
