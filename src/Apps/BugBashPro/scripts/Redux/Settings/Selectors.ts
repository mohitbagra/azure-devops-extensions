import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { IBugBashSettingsAwareState, IProjectSettingState, IUserSettingState } from "./Contracts";

export function getUserSettingState(state: IBugBashSettingsAwareState): IUserSettingState | undefined {
    return state.userSettingState;
}

export function getProjectSettingState(state: IBugBashSettingsAwareState): IProjectSettingState | undefined {
    return state.projectSettingState;
}

export const getUserSettings = createSelector(
    getUserSettingState,
    state => state && state.settings
);

export const getUserSettingsStatus = createSelector(
    getUserSettingState,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getProjectSetting = createSelector(
    getProjectSettingState,
    state => state && state.settings
);

export const getProjectSettingStatus = createSelector(
    getProjectSettingState,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getCurrentUserSettings = createSelector(
    getUserSettingState,
    state => state && state.currentUserSetting
);
