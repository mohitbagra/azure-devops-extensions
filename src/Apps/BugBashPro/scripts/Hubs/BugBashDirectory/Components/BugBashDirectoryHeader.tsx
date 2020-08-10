import * as React from "react";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { BugBashPortalActions } from "BugBashPro/Portals/BugBashPortal/Redux/Actions";
import { Resources } from "BugBashPro/Resources";
import { BugBashesActions } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";

import { DirectoryPageHeaderCommands } from "../Constants";
import { useFilteredBugBashes } from "../Hooks/useFilteredBugBashes";

const Actions = {
    openBugBashPortal: BugBashPortalActions.openBugBashPortal,
    openSettingsPortal: BugBashPortalActions.openSettingsPortal,
    loadBugBashes: BugBashesActions.bugBashesLoadRequested
};

export function BugBashDirectoryHeader(): JSX.Element {
    const { status } = useFilteredBugBashes();
    const { openBugBashPortal, openSettingsPortal, loadBugBashes } = useActionCreators(Actions);
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
                        openBugBashPortal(undefined);
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
                    onActivate: () => {
                        openSettingsPortal();
                    }
                }
            ]}
            titleSize={TitleSize.Large}
        />
    );
}
