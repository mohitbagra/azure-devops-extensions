import { IProjectSetting, IUserSetting } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const UserSettingActions = {
    userSettingsLoadRequested: () => createAction(UserSettingActionTypes.UserSettingsLoadRequested),
    beginLoadUserSettings: () => createAction(UserSettingActionTypes.BeginLoadUserSettings),
    userSettingsLoaded: (userSettings: IUserSetting[]) => createAction(UserSettingActionTypes.UserSettingsLoaded, userSettings),

    userSettingUpdateRequested: (userSetting: IUserSetting) => createAction(UserSettingActionTypes.UserSettingUpdateRequested, userSetting),
    userSettingUpdated: (userSetting: IUserSetting) => createAction(UserSettingActionTypes.UserSettingUpdated, userSetting)
};

export const ProjectSettingActions = {
    projectSettingLoadRequested: () => createAction(ProjectSettingActionTypes.ProjectSettingLoadRequested),
    beginLoadProjectSetting: () => createAction(ProjectSettingActionTypes.BeginLoadProjectSetting),
    projectSettingLoaded: (projectSetting: IProjectSetting) => createAction(ProjectSettingActionTypes.ProjectSettingLoaded, projectSetting),

    projectSettingUpdateRequested: (projectSetting: IProjectSetting) =>
        createAction(ProjectSettingActionTypes.ProjectSettingUpdateRequested, projectSetting),
    projectSettingUpdated: (projectSetting: IProjectSetting) => createAction(ProjectSettingActionTypes.ProjectSettingUpdated, projectSetting)
};

export const enum UserSettingActionTypes {
    UserSettingsLoadRequested = "BugBashUserSetting/UserSettingsLoadRequested",
    BeginLoadUserSettings = "BugBashUserSetting/BeginLoadUserSettings",
    UserSettingsLoaded = "BugBashUserSetting/UserSettingsLoaded",

    UserSettingUpdateRequested = "BugBashUserSetting/UserSettingUpdateRequested",
    UserSettingUpdated = "BugBashUserSetting/UserSettingUpdated"
}

export const enum ProjectSettingActionTypes {
    ProjectSettingLoadRequested = "BugBashProjectSetting/ProjectSettingLoadRequested",
    BeginLoadProjectSetting = "BugBashProjectSetting/BeginLoadProjectSetting",
    ProjectSettingLoaded = "BugBashProjectSetting/ProjectSettingLoaded",

    ProjectSettingUpdateRequested = "BugBashProjectSetting/ProjectSettingUpdateRequested",
    ProjectSettingUpdated = "BugBashProjectSetting/ProjectSettingUpdated"
}

export type UserSettingActions = ActionsUnion<typeof UserSettingActions>;
export type ProjectSettingActions = ActionsUnion<typeof ProjectSettingActions>;
