import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { IBugBashSettingsAwareState, IProjectSettingState } from "./Contracts";

export function getProjectSettingState(state: IBugBashSettingsAwareState): IProjectSettingState | undefined {
    return state.projectSettingState;
}

export const getProjectSetting = createSelector(
    getProjectSettingState,
    state => state && state.settings
);

export const getProjectSettingStatus = createSelector(
    getProjectSettingState,
    state => (state && state.status) || LoadStatus.NotLoaded
);
