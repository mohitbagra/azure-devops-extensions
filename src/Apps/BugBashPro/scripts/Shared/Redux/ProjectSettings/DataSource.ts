import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { readSetting, writeSetting } from "Common/ServiceWrappers/ExtensionDataManager";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export async function fetchProjectSettingAsync(): Promise<IProjectSetting> {
    const projectId = await getCurrentProjectId();
    return readSetting<IProjectSetting>(`bugBashProSettings_${projectId}`, { gitMediaRepo: "" }, false) as Promise<IProjectSetting>;
}

export async function updateProjectSettingAsync(projectSetting: IProjectSetting): Promise<IProjectSetting> {
    const projectId = await getCurrentProjectId();
    return writeSetting<IProjectSetting>(`bugBashProSettings_${projectId}`, projectSetting, false);
}
