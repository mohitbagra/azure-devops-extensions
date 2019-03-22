import { IProjectSetting, IUserSetting } from "BugBashPro/Shared/Contracts";
import {
    addOrUpdateDocument, readDocuments, readSetting, writeSetting
} from "Common/ServiceWrappers/ExtensionDataManager";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export async function fetchUserSettingsAsync(): Promise<IUserSetting[]> {
    const projectId = await getCurrentProjectId();
    return readDocuments<IUserSetting>(`UserSettings_${projectId}`, false);
}

export async function updateUserSettingAsync(userSetting: IUserSetting): Promise<IUserSetting> {
    const projectId = await getCurrentProjectId();
    return addOrUpdateDocument(`UserSettings_${projectId}`, userSetting, false);
}

export async function fetchProjectSettingAsync(): Promise<IProjectSetting> {
    const projectId = await getCurrentProjectId();
    return readSetting<IProjectSetting>(`bugBashProSettings_${projectId}`, { gitMediaRepo: "" }, false) as Promise<IProjectSetting>;
}

export async function updateProjectSettingAsync(projectSetting: IProjectSetting): Promise<IProjectSetting> {
    const projectId = await getCurrentProjectId();
    return writeSetting<IProjectSetting>(`bugBashProSettings_${projectId}`, projectSetting, false);
}
