import { Header, TitleSize } from "azure-devops-ui/Header";
import { BugBashEditorPortalActions } from "BugBashPro/Portals/BugBashEditorPortal/Redux";
import { BugBashSettingsPortalActions } from "BugBashPro/Portals/BugBashSettingsEditorPortal/Redux";
import { Resources } from "BugBashPro/Resources";
import { BugBashesActions } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { DirectoryPageHeaderCommands } from "../Constants";
import { useFilteredBugBashes } from "../Hooks/useFilteredBugBashes";

const Actions = {
    openSettingsPanel: BugBashSettingsPortalActions.openPortal,
    openEditorPanel: BugBashEditorPortalActions.openPortal,
    loadBugBashes: BugBashesActions.bugBashesLoadRequested
};

export function BugBashDirectoryHeader(): JSX.Element {
    const { status } = useFilteredBugBashes();
    const { openSettingsPanel, openEditorPanel, loadBugBashes } = useActionCreators(Actions);
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
                        openEditorPanel(undefined, { readFromCache: false });
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
