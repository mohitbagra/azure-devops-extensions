import "./SettingsEditor.scss";

import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { Panel } from "azure-devops-ui/Panel";
import { getBugBashSettingsModule } from "BugBashPro/Redux/Settings";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { BugBashSettingsPortalActions, IBugBashSettingsPortalAwareState, isSettingsPortalOpen } from "../Redux/Portal";
import { ProjectSettingEditor } from "./ProjectSettingEditor";
import { UserSettingEditor } from "./UserSettingEditor";

interface IDynamicSettingsPortalStateProps {
    panelOpen: boolean;
}

function mapStateToProps(state: IBugBashSettingsPortalAwareState): IDynamicSettingsPortalStateProps {
    return {
        panelOpen: isSettingsPortalOpen(state)
    };
}

const Actions = {
    dismissPortal: BugBashSettingsPortalActions.dismissPortal
};

function DynamicSettingsPortalInternal() {
    const { panelOpen } = useMappedState(mapStateToProps);
    const { dismissPortal } = useActionCreators(Actions);

    if (!panelOpen) {
        return null;
    }

    return (
        <Panel blurDismiss={false} className="settings-editor-panel" size={ContentSize.Small} onDismiss={dismissPortal}>
            <div className="settings-editor-panel-content flex-grow">
                <div className="settings-editor-panel-content-section flex-column">
                    <ProjectSettingEditor />
                </div>
                <div className="settings-editor-panel-content-section flex-column">
                    <UserSettingEditor />
                </div>
            </div>
        </Panel>
    );
}

export function DynamicSettingsPortal() {
    return (
        <DynamicModuleLoader modules={[getBugBashSettingsModule()]}>
            <DynamicSettingsPortalInternal />
        </DynamicModuleLoader>
    );
}
