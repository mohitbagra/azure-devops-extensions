export interface IBugBashEditorPortalAwareState {
    bugBashEditorPortalState: IBugBashEditorPortalState;
}

export interface IBugBashEditorPortalState {
    portalOpen: boolean;
    readFromCache: boolean;
    bugBashId?: string;
}

export const defaultBugBashEditorPortalState: IBugBashEditorPortalState = {
    portalOpen: false,
    readFromCache: true
};
