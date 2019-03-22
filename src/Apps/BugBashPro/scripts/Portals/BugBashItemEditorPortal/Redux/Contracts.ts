import { IBugBash } from "BugBashPro/Shared/Contracts";

export interface IBugBashItemEditorPortalAwareState {
    bugBashItemEditorPortalState: IBugBashItemEditorPortalState;
}

export interface IBugBashItemEditorPortalState {
    portalOpen: boolean;
    bugBash?: IBugBash;
    bugBashItemId?: string;
}

export const defaultBugBashItemEditorPortalState: IBugBashItemEditorPortalState = {
    portalOpen: false
};
