import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { readSetting, writeSetting } from "Common/ServiceWrappers/ExtensionDataManager";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchProjectSettingAsync = memoizePromise(
    async () => {
        const projectId = await getCurrentProjectId();
        return readSetting<IProjectSetting>(`bugBashProSettings_${projectId}`, { gitMediaRepo: "" }, false) as Promise<IProjectSetting>;
    },
    () => "fetchProjectSetting"
);

export const updateProjectSettingAsync = memoizePromise(
    async (projectSetting: IProjectSetting) => {
        const projectId = await getCurrentProjectId();
        return writeSetting<IProjectSetting>(`bugBashProSettings_${projectId}`, projectSetting, false);
    },
    () => "updateProjectSetting"
);
