import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { getCurrentUserSetting, getUserSettingsStatus, IBugBashSettingsAwareState, UserSettingActions } from "BugBashPro/Shared/Redux/UserSettings";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";

export function useCurrentUserSetting(): IUseCurrentUserSettingMappedState {
    const { userSetting, status } = useMappedState(mapState);
    const { loadUserSettings } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadUserSettings();
        }
    }, []);

    return { userSetting, status };
}

interface IUseCurrentUserSettingMappedState {
    userSetting: IUserSetting | undefined;
    status: LoadStatus;
}

function mapState(state: IBugBashSettingsAwareState): IUseCurrentUserSettingMappedState {
    return {
        userSetting: getCurrentUserSetting(state),
        status: getUserSettingsStatus(state)
    };
}

const Actions = {
    loadUserSettings: UserSettingActions.userSettingsLoadRequested
};
