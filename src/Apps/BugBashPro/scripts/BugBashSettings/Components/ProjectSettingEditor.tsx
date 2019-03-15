import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { Button } from "azure-devops-ui/Button";
import { equals } from "azure-devops-ui/Core/Util/String";
import {
    getProjectSetting, getProjectSettingStatus, IBugBashSettingsAwareState, ProjectSettingActions
} from "BugBashPro/Redux/Settings";
import { Resources } from "BugBashPro/Resources";
import { IProjectSetting, LoadStatus } from "BugBashPro/Shared/Contracts";
import { GitRepoPicker } from "Common/Components/AzDev/GitRepoPicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import { useControlledState } from "Common/Hooks/useControlledState";
import * as React from "react";

interface IProjectSettingsEditorStateProps {
    projectSetting?: IProjectSetting;
    status: LoadStatus;
}

function mapStateToProps(state: IBugBashSettingsAwareState): IProjectSettingsEditorStateProps {
    return {
        projectSetting: getProjectSetting(state),
        status: getProjectSettingStatus(state)
    };
}

const Actions = {
    loadProjectSetting: ProjectSettingActions.projectSettingLoadRequested,
    updateProjectSetting: ProjectSettingActions.projectSettingUpdateRequested
};

export function ProjectSettingEditor() {
    const { projectSetting: prop_projectSetting, status } = useMappedState(mapStateToProps);
    const { loadProjectSetting, updateProjectSetting } = useActionCreators(Actions);

    const [projectSetting, setProjectSetting] = useControlledState<IProjectSetting | undefined>(prop_projectSetting);

    React.useEffect(() => {
        if (!prop_projectSetting && status !== LoadStatus.Loading) {
            loadProjectSetting();
        }
    }, []);

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
