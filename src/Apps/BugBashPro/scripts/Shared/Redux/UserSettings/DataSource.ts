import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { addOrUpdateDocument, readDocuments } from "Common/ServiceWrappers/ExtensionDataManager";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export async function fetchUserSettingsAsync(): Promise<IUserSetting[]> {
    const projectId = await getCurrentProjectId();
    return readDocuments<IUserSetting>(`UserSettings_${projectId}`, false);
}

export async function updateUserSettingAsync(userSetting: IUserSetting): Promise<IUserSetting> {
    const projectId = await getCurrentProjectId();
    return addOrUpdateDocument(`UserSettings_${projectId}`, userSetting, false);
}
