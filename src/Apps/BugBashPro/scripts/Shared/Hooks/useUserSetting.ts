import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { getUserSetting, getUserSettingsStatus, IBugBashSettingsAwareState, UserSettingActions } from "BugBashPro/Shared/Redux/Settings";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";

export function useUserSetting(userEmail: string): IUseUserSettingMappedState {
    const mapStateToProps = useCallback(
        (state: IBugBashSettingsAwareState): IUseUserSettingMappedState => {
            return {
                userSetting: getUserSetting(state, userEmail),
                status: getUserSettingsStatus(state)
            };
        },
        [userEmail]
    );

    const { userSetting, status } = useMappedState(mapStateToProps);
    const { loadUserSettings } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadUserSettings();
        }
    }, []);

    return { userSetting, status };
}

interface IUseUserSettingMappedState {
    userSetting: IUserSetting | undefined;
    status: LoadStatus;
}

const Actions = {
    loadUserSettings: UserSettingActions.userSettingsLoadRequested
};
