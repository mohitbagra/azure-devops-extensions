import { getProjectSetting, getProjectSettingStatus, IBugBashSettingsAwareState, ProjectSettingActions } from "BugBashPro/Redux/Settings";
import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";

export function useProjectSetting(): IUseProjectSettingEditorMappedState {
    const { projectSetting, status } = useMappedState(mapStateToProps);
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

function mapStateToProps(state: IBugBashSettingsAwareState): IUseProjectSettingEditorMappedState {
    return {
        projectSetting: getProjectSetting(state),
        status: getProjectSettingStatus(state)
    };
}

const Actions = {
    loadProjectSetting: ProjectSettingActions.projectSettingLoadRequested
};
