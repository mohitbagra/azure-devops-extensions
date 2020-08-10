import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";

export interface IBugBashSettingsAwareState {
    projectSettingState: IProjectSettingState;
}

export interface IProjectSettingState {
    status: LoadStatus;
    settings?: IProjectSetting;
    error?: string;
}

export const defaultProjectSettingState: IProjectSettingState = {
    status: LoadStatus.NotLoaded
};
