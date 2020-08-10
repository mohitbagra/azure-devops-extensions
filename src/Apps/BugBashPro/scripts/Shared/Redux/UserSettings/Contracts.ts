import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";

export interface IBugBashSettingsAwareState {
    userSettingState: IUserSettingState;
}

export interface IUserSettingState {
    status: LoadStatus;
    settings?: IUserSetting[];
    currentUserSetting?: IUserSetting;
    error?: string;
}

export const defaultUserSettingState: IUserSettingState = {
    status: LoadStatus.NotLoaded
};
