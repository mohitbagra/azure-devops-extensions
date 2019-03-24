import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { IBugBashSettingsAwareState, IUserSettingState } from "./Contracts";

export function getUserSettingState(state: IBugBashSettingsAwareState): IUserSettingState | undefined {
    return state.userSettingState;
}

export const getUserSettings = createSelector(
    getUserSettingState,
    state => state && state.settings
);

export const getUserSettingsMap = createSelector(
    getUserSettingState,
    state => {
        if (state && state.settings) {
            const map: { [key: string]: IUserSetting } = {};
            state.settings.forEach(s => {
                map[s.id.toLowerCase()] = s;
            });

            return map;
        }
        return undefined;
    }
);

export const getUserSettingsStatus = createSelector(
    getUserSettingState,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getCurrentUserSetting = createSelector(
    getUserSettingState,
    state => state && state.currentUserSetting
);
