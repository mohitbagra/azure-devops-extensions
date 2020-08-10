import "./SettingsEditor.scss";

import * as React from "react";

import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { Panel } from "azure-devops-ui/Panel";
import { getBugBashProjectSettingsModule } from "BugBashPro/Shared/Redux/ProjectSettings/Module";
import { getBugBashUserSettingsModule } from "BugBashPro/Shared/Redux/UserSettings/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";

import { ProjectSettingEditor } from "./ProjectSettingEditor";
import { UserSettingEditor } from "./UserSettingEditor";

interface IBugBashSettingsEditorPanelProps {
    onDismiss(): void;
}

function BugBashSettingsEditorPanelInternal(props: IBugBashSettingsEditorPanelProps) {
    const { onDismiss } = props;
    return (
        <Panel blurDismiss={false} className="settings-editor-panel" size={ContentSize.Small} onDismiss={onDismiss}>
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

export function BugBashSettingsEditorPanel(props: IBugBashSettingsEditorPanelProps) {
    return (
        <DynamicModuleLoader modules={[getBugBashUserSettingsModule(), getBugBashProjectSettingsModule()]}>
            <BugBashSettingsEditorPanelInternal {...props} />
        </DynamicModuleLoader>
    );
}
