import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { addOrUpdateDocument, readDocuments } from "Common/ServiceWrappers/ExtensionDataManager";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchUserSettingsAsync = memoizePromise(
    async () => {
        const projectId = await getCurrentProjectId();
        return readDocuments<IUserSetting>(`UserSettings_${projectId}`, false);
    },
    () => "fetchUserSettings"
);

export const updateUserSettingAsync = memoizePromise(
    async (userSetting: IUserSetting) => {
        const projectId = await getCurrentProjectId();
        return addOrUpdateDocument(`UserSettings_${projectId}`, userSetting, false);
    },
    () => "updateUserSetting"
);
