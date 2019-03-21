import { getCurrentUserSetting, getUserSettingsStatus, IBugBashSettingsAwareState, UserSettingActions } from "BugBashPro/Redux/Settings";
import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";

export function useCurrentUserSetting(): IUseCurrentUserSettingMappedState {
    const { userSetting, status } = useMappedState(mapStateToProps);
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

function mapStateToProps(state: IBugBashSettingsAwareState): IUseCurrentUserSettingMappedState {
    return {
        userSetting: getCurrentUserSetting(state),
        status: getUserSettingsStatus(state)
    };
}

const Actions = {
    loadUserSettings: UserSettingActions.userSettingsLoadRequested
};
