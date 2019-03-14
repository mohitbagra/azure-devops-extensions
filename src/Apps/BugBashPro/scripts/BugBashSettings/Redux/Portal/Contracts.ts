export interface IBugBashSettingsPortalAwareState {
    settingsPortalState: IBugBashSettingsPortalState;
}

export interface IBugBashSettingsPortalState {
    portalOpen: boolean;
}

export const defaultBugBashSettingsPortalState: IBugBashSettingsPortalState = {
    portalOpen: false
};
