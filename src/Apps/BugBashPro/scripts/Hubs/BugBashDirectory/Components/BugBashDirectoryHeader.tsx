import { Header, TitleSize } from "azure-devops-ui/Header";
import { BugBashPortalActions } from "BugBashPro/Portals/BugBashPortal/Redux/Actions";
import { IBugBashEditPortalProps, PortalType } from "BugBashPro/Portals/BugBashPortal/Redux/Contracts";
import { Resources } from "BugBashPro/Resources";
import { BugBashesActions } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { DirectoryPageHeaderCommands } from "../Constants";
import { useFilteredBugBashes } from "../Hooks/useFilteredBugBashes";

const Actions = {
    openPortal: BugBashPortalActions.openPortal,
    loadBugBashes: BugBashesActions.bugBashesLoadRequested
};

export function BugBashDirectoryHeader(): JSX.Element {
    const { status } = useFilteredBugBashes();
    const { openPortal, loadBugBashes } = useActionCreators(Actions);
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
                        openPortal(PortalType.BugBashEdit, { bugBashId: undefined, readFromCache: true } as IBugBashEditPortalProps);
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
                        openPortal(PortalType.SettingsEdit, undefined);
                    }
                }
            ]}
            titleSize={TitleSize.Large}
        />
    );
}
