import { IProjectSetting, IUserSetting } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";

export interface IBugBashSettingsAwareState {
    userSettingState: IUserSettingState;
    projectSettingState: IProjectSettingState;
}

export interface IUserSettingState {
    status: LoadStatus;
    settings?: IUserSetting[];
    currentUserSetting?: IUserSetting;
    error?: string;
}

export interface IProjectSettingState {
    status: LoadStatus;
    settings?: IProjectSetting;
    error?: string;
}

export const defaultUserSettingState: IUserSettingState = {
    status: LoadStatus.NotLoaded
};

export const defaultProjectSettingState: IProjectSettingState = {
    status: LoadStatus.NotLoaded
};
