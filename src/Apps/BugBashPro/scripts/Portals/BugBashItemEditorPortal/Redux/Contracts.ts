export interface IBugBashItemEditorPortalAwareState {
    bugBashItemEditorPortalState: IBugBashItemEditorPortalState;
}

export interface IBugBashItemEditorPortalState {
    portalOpen: boolean;
    readFromCache: boolean;
    bugBashId?: string;
    bugBashItemId?: string;
}

export const defaultBugBashItemEditorPortalState: IBugBashItemEditorPortalState = {
    portalOpen: false,
    readFromCache: true
};
