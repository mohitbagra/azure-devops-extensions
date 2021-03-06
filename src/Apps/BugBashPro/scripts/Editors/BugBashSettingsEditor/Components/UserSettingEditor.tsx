import * as React from "react";

import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { Button } from "azure-devops-ui/Button";
import { equals } from "azure-devops-ui/Core/Util/String";
import { Resources } from "BugBashPro/Resources";
import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { useCurrentUserSetting } from "BugBashPro/Shared/Hooks/useCurrentUserSetting";
import { UserSettingActions } from "BugBashPro/Shared/Redux/UserSettings/Actions";
import { TeamPicker } from "Common/AzDev/Teams/Components/TeamPicker";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useControlledState } from "Common/Hooks/useControlledState";

const Actions = {
    updateUserSetting: UserSettingActions.userSettingUpdateRequested
};

export function UserSettingEditor() {
    const { userSetting: prop_userSetting, status } = useCurrentUserSetting();
    const { updateUserSetting } = useActionCreators(Actions);
    const [userSetting, setUserSetting] = useControlledState<IUserSetting | undefined>(prop_userSetting);

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
            <div className="section-header font-size-l font-weight-heavy">{Resources.UserSettingsHeader}</div>
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
