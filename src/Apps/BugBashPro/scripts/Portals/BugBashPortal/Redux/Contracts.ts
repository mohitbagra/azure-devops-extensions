export interface IBugBashPortalAwareState {
    portalState: IBugBashPortalState;
}

export interface IBugBashPortalState {
    portalOpen: boolean;
    portalType: PortalType | undefined;
    portalProps: IBugBashEditPortalProps | IBugBashItemEditPortalProps | undefined;
}

export const defaultBugBashPortalState: IBugBashPortalState = {
    portalOpen: false,
    portalType: undefined,
    portalProps: undefined
};

export const enum PortalType {
    BugBashEdit = 1,
    BugBashItemEdit,
    SettingsEdit
}

export interface IBugBashEditPortalProps {
    bugBashId: string | undefined;
    readFromCache: boolean;
}

export interface IBugBashItemEditPortalProps {
    bugBashId: string;
    bugBashItemId: string | undefined;
    readFromCache: boolean;
}
