import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { getUserSettings, getUserSettingsStatus, IBugBashSettingsAwareState, UserSettingActions } from "BugBashPro/Shared/Redux/UserSettings";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";

export function useUserSettings(): IUseUserSettingsMappedState {
    const { userSettings, status } = useMappedState(mapState);
    const { loadUserSettings } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadUserSettings();
        }
    }, []);

    return { userSettings, status };
}

function mapState(state: IBugBashSettingsAwareState): IUseUserSettingsMappedState {
    return {
        userSettings: getUserSettings(state),
        status: getUserSettingsStatus(state)
    };
}

interface IUseUserSettingsMappedState {
    userSettings: IUserSetting[] | undefined;
    status: LoadStatus;
}

const Actions = {
    loadUserSettings: UserSettingActions.userSettingsLoadRequested
};
