import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { ActionsUnion, createAction } from "Common/Redux";

export const ProjectSettingActions = {
    projectSettingLoadRequested: () => createAction(ProjectSettingActionTypes.ProjectSettingLoadRequested),
    beginLoadProjectSetting: () => createAction(ProjectSettingActionTypes.BeginLoadProjectSetting),
    projectSettingLoaded: (projectSetting: IProjectSetting) => createAction(ProjectSettingActionTypes.ProjectSettingLoaded, projectSetting),

    projectSettingUpdateRequested: (projectSetting: IProjectSetting) =>
        createAction(ProjectSettingActionTypes.ProjectSettingUpdateRequested, projectSetting),
    projectSettingUpdated: (projectSetting: IProjectSetting) => createAction(ProjectSettingActionTypes.ProjectSettingUpdated, projectSetting)
};

export const enum ProjectSettingActionTypes {
    ProjectSettingLoadRequested = "BugBashProjectSetting/ProjectSettingLoadRequested",
    BeginLoadProjectSetting = "BugBashProjectSetting/BeginLoadProjectSetting",
    ProjectSettingLoaded = "BugBashProjectSetting/ProjectSettingLoaded",

    ProjectSettingUpdateRequested = "BugBashProjectSetting/ProjectSettingUpdateRequested",
    ProjectSettingUpdated = "BugBashProjectSetting/ProjectSettingUpdated"
}

export type ProjectSettingActions = ActionsUnion<typeof ProjectSettingActions>;
