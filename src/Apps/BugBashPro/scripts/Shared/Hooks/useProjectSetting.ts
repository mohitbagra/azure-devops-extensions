import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { getProjectSetting, getProjectSettingStatus, IBugBashSettingsAwareState, ProjectSettingActions } from "BugBashPro/Shared/Redux/Settings";
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
