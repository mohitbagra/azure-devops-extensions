import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { Button } from "azure-devops-ui/Button";
import { equals } from "azure-devops-ui/Core/Util/String";
import {
    getCurrentUserSettings, getUserSettingsStatus, IBugBashSettingsAwareState, UserSettingActions
} from "BugBashPro/Redux/Settings";
import { Resources } from "BugBashPro/Resources";
import { IUserSetting, LoadStatus } from "BugBashPro/Shared/Contracts";
import { TeamPicker } from "Common/Components/AzDev/TeamPicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import { useControlledState } from "Common/Hooks/useControlledState";
import * as React from "react";

interface IUserSettingsEditorStateProps {
    userSetting?: IUserSetting;
    status: LoadStatus;
}

function mapStateToProps(state: IBugBashSettingsAwareState): IUserSettingsEditorStateProps {
    return {
        userSetting: getCurrentUserSettings(state),
        status: getUserSettingsStatus(state)
    };
}

const Actions = {
    loadUserSettings: UserSettingActions.userSettingsLoadRequested,
    updateUserSetting: UserSettingActions.userSettingUpdateRequested
};

export function UserSettingEditor() {
    const { userSetting: prop_userSetting, status } = useMappedState(mapStateToProps);
    const { loadUserSettings, updateUserSetting } = useActionCreators(Actions);

    const [userSetting, setUserSetting] = useControlledState<IUserSetting | undefined>(prop_userSetting);

    React.useEffect(() => {
        if (!prop_userSetting && status !== LoadStatus.Loading) {
            loadUserSettings();
        }
    }, []);

    const isUserSettingDirty = !equals(
        (prop_userSetting && prop_userSetting.associatedTeam) || "",
        (userSetting && userSetting.associatedTeam) || "",
        true
    );
    const saveUserSetting = () => {
        if (isUserSettingDirty && userSetting) {
            updateUserSetting(userSetting);
        }
    };
    const onTeamChange = (option: WebApiTeam, value?: string) => {
        setUserSetting({ ...userSetting, associatedTeam: option ? option.id : value || "" } as IUserSetting);
    };

    const isLoading = !userSetting || status === LoadStatus.Loading;

    return (
        <>
            <div className="section-header fontSizeL fontWeightHeavy">{Resources.UserSettingsHeader}</div>
            <TeamPicker
                label={Resources.AssociatedTeamLabel}
                info={Resources.AssociatedTeamLabel_Info}
                selectedValue={userSetting && userSetting.associatedTeam}
                onChange={onTeamChange}
                disabled={isLoading}
            />
            <Button className="save-button flex-self-end" primary={true} disabled={!isUserSettingDirty} onClick={saveUserSetting}>
                Save
            </Button>
        </>
    );
}
