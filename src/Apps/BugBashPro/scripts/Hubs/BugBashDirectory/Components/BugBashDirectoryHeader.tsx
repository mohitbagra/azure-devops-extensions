import { Header, TitleSize } from "azure-devops-ui/Header";
import { BugBashEditorPortalActions } from "BugBashPro/Portals/BugBashEditorPortal/Redux";
import { BugBashSettingsPortalActions } from "BugBashPro/Portals/BugBashSettingsEditorPortal/Redux";
import { Resources } from "BugBashPro/Resources";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { DirectoryPageHeaderCommands } from "../Constants";
import { useBugBashes } from "../Hooks/useBugBashes";

const Actions = {
    openSettingsPanel: BugBashSettingsPortalActions.openPortal,
    openEditorPanel: BugBashEditorPortalActions.openPortal
};

export function BugBashDirectoryHeader(): JSX.Element {
    const { status, loadBugBashes } = useBugBashes();
    const { openSettingsPanel, openEditorPanel } = useActionCreators(Actions);
    const isLoading = status === LoadStatus.Loading || status === LoadStatus.NotLoaded;

    return (
        <Header
            className="bugbash-page-header"
            title={Resources.DirectoryPageHeader}
            commandBarItems={[
                {
                    ...DirectoryPageHeaderCommands.new,
                    disabled: isLoading,
                    onActivate: () => {
                        openEditorPanel();
                    }
                },
                {
                    ...DirectoryPageHeaderCommands.refresh,
                    disabled: isLoading,
                    onActivate: loadBugBashes
                },
                {
                    ...DirectoryPageHeaderCommands.settings,
                    disabled: isLoading,
                    onActivate: openSettingsPanel
                }
            ]}
            titleSize={TitleSize.Large}
        />
    );
}
