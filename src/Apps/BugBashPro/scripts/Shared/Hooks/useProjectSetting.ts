import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { ProjectSettingActions } from "BugBashPro/Shared/Redux/ProjectSettings/Actions";
import { IBugBashSettingsAwareState } from "BugBashPro/Shared/Redux/ProjectSettings/Contracts";
import { getProjectSetting, getProjectSettingStatus } from "BugBashPro/Shared/Redux/ProjectSettings/Selectors";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";

export function useProjectSetting(): IUseProjectSettingEditorMappedState {
    const { projectSetting, status } = useMappedState(mapState);
    const { loadProjectSetting } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadProjectSetting();
        }
    }, []);

    return { projectSetting, status };
}

interface IUseProjectSettingEditorMappedState {
    projectSetting: IProjectSetting | undefined;
    status: LoadStatus;
}

function mapState(state: IBugBashSettingsAwareState): IUseProjectSettingEditorMappedState {
    return {
        projectSetting: getProjectSetting(state),
        status: getProjectSettingStatus(state)
    };
}

const Actions = {
    loadProjectSetting: ProjectSettingActions.projectSettingLoadRequested
};
