import { equals } from "azure-devops-ui/Core/Util/String";
import { LoadStatus } from "Common/Contracts";
import { getCurrentUser } from "Common/Utilities/Identity";
import { produce } from "immer";
import { UserSettingActions, UserSettingActionTypes } from "./Actions";
import { defaultUserSettingState, IUserSettingState } from "./Contracts";

export function userSettingReducer(state: IUserSettingState | undefined, action: UserSettingActions): IUserSettingState {
    return produce(state || defaultUserSettingState, draft => {
        switch (action.type) {
            case UserSettingActionTypes.BeginLoadUserSettings: {
                draft.status = LoadStatus.Loading;
                draft.settings = undefined;
                draft.error = undefined;
                break;
            }

            case UserSettingActionTypes.UserSettingsLoaded: {
                const userSettings = action.payload;
                const currentUserAlias = getCurrentUser().uniqueName;
                draft.settings = userSettings;
                draft.currentUserSetting = userSettings.find(s => equals(s.id, currentUserAlias, true)) || {
                    associatedTeam: "",
                    id: currentUserAlias
                };
                draft.status = LoadStatus.Ready;
                draft.error = undefined;
                break;
            }

            case UserSettingActionTypes.UserSettingUpdated: {
                const userSetting = action.payload;
                draft.currentUserSetting = userSetting;
                if (draft.settings) {
                    const index = draft.settings.findIndex(s => equals(s.id, userSetting.id, true));
                    if (index !== -1) {
                        draft.settings[index] = userSetting;
                    } else {
                        draft.settings.push(userSetting);
                    }
                }
            }
        }
    });
}
