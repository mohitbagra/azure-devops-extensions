import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { Button } from "azure-devops-ui/Button";
import { equals } from "azure-devops-ui/Core/Util/String";
import { Resources } from "BugBashPro/Resources";
import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { useProjectSetting } from "BugBashPro/Shared/Hooks/useProjectSetting";
import { ProjectSettingActions } from "BugBashPro/Shared/Redux/ProjectSettings/Actions";
import { GitRepoPicker } from "Common/AzDev/GitRepos/Components";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useControlledState } from "Common/Hooks/useControlledState";
import * as React from "react";

const Actions = {
    updateProjectSetting: ProjectSettingActions.projectSettingUpdateRequested
};

export function ProjectSettingEditor() {
    const { projectSetting: prop_projectSetting, status } = useProjectSetting();
    const { updateProjectSetting } = useActionCreators(Actions);

    const [projectSetting, setProjectSetting] = useControlledState<IProjectSetting | undefined>(prop_projectSetting);

    const isProjectSettingDirty = !equals(
        (prop_projectSetting && prop_projectSetting.gitMediaRepo) || "",
        (projectSetting && projectSetting.gitMediaRepo) || "",
        true
    );
    const saveProjectSetting = () => {
        if (isProjectSettingDirty && projectSetting) {
            updateProjectSetting(projectSetting);
        }
    };
    const onGitRepoChange = (option: GitRepository, value?: string) => {
        setProjectSetting({ ...projectSetting, gitMediaRepo: option ? option.id : value || "" });
    };
    const isLoading = !projectSetting || status === LoadStatus.Loading;

    return (
        <>
            <div className="section-header fontSizeL fontWeightHeavy">{Resources.ProjectSettingsHeader}</div>
            <GitRepoPicker
                label={Resources.GitRepoPickerLabel}
                info={Resources.GitRepoPickerLabel_Info}
                selectedValue={projectSetting && projectSetting.gitMediaRepo}
                onChange={onGitRepoChange}
                disabled={isLoading}
            />
            <Button className="save-button flex-self-end" primary={true} disabled={!isProjectSettingDirty} onClick={saveProjectSetting}>
                Save
            </Button>
        </>
    );
}
