import { IBugBash } from "BugBashPro/Shared/Contracts";

export interface IBugBashItemEditorPortalAwareState {
    bugBashItemEditorPortalState: IBugBashItemEditorPortalState;
}

export interface IBugBashItemEditorPortalState {
    portalOpen: boolean;
    readFromCache: boolean;
    bugBash?: IBugBash;
    bugBashItemId?: string;
}

export const defaultBugBashItemEditorPortalState: IBugBashItemEditorPortalState = {
    portalOpen: false,
    readFromCache: true
};
