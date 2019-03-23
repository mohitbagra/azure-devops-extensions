import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const UserSettingActions = {
    userSettingsLoadRequested: () => createAction(UserSettingActionTypes.UserSettingsLoadRequested),
    beginLoadUserSettings: () => createAction(UserSettingActionTypes.BeginLoadUserSettings),
    userSettingsLoaded: (userSettings: IUserSetting[]) => createAction(UserSettingActionTypes.UserSettingsLoaded, userSettings),

    userSettingUpdateRequested: (userSetting: IUserSetting) => createAction(UserSettingActionTypes.UserSettingUpdateRequested, userSetting),
    userSettingUpdated: (userSetting: IUserSetting) => createAction(UserSettingActionTypes.UserSettingUpdated, userSetting)
};

export const enum UserSettingActionTypes {
    UserSettingsLoadRequested = "BugBashUserSetting/UserSettingsLoadRequested",
    BeginLoadUserSettings = "BugBashUserSetting/BeginLoadUserSettings",
    UserSettingsLoaded = "BugBashUserSetting/UserSettingsLoaded",

    UserSettingUpdateRequested = "BugBashUserSetting/UserSettingUpdateRequested",
    UserSettingUpdated = "BugBashUserSetting/UserSettingUpdated"
}

export type UserSettingActions = ActionsUnion<typeof UserSettingActions>;
