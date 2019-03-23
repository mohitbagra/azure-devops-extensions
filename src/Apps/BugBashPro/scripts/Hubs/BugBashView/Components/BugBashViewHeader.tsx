import { Button } from "azure-devops-ui/Button";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { BugBashEditorPortalActions } from "BugBashPro/Portals/BugBashEditorPortal/Redux";
import { BugBashItemEditorPortalActions } from "BugBashPro/Portals/BugBashItemEditorPortal/Redux";
import { Resources } from "BugBashPro/Resources";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { isBugBashCompleted, isBugBashInProgress } from "BugBashPro/Shared/Helpers";
import { navigateToDirectory } from "BugBashPro/Shared/NavHelpers";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { BugBashViewHeaderCommands } from "../Constants";
import { useFilteredBugBashItems } from "../Hooks/useFilteredBugBashItems";
import { IBugBashViewBaseProps } from "../Interfaces";

const Actions = {
    openBugBashEditorPanel: BugBashEditorPortalActions.openPortal,
    openNewBugBashItemPanel: BugBashItemEditorPortalActions.openPortal,
    loadBugBashItems: BugBashItemsActions.bugBashItemsLoadRequested
};

export function BugBashViewHeader(props: IBugBashViewBaseProps) {
    const { bugBash } = props;
    const { status } = useFilteredBugBashItems(bugBash.id!);
    const { openNewBugBashItemPanel, openBugBashEditorPanel, loadBugBashItems } = useActionCreators(Actions);

    const renderHeaderTitle = React.useMemo(() => onRenderHeaderTitle(bugBash), [bugBash]);
    const isLoading = status !== LoadStatus.Ready;

    return (
        <Header
            className="bugbash-page-header bugbash-view-page-header"
            title={renderHeaderTitle}
            commandBarItems={[
                {
                    ...BugBashViewHeaderCommands.new,
                    disabled: isLoading,
                    onActivate: () => {
                        openNewBugBashItemPanel(bugBash);
                    }
                },
                {
                    ...BugBashViewHeaderCommands.edit,
                    disabled: isLoading,
                    onActivate: () => {
                        openBugBashEditorPanel(bugBash.id);
                    }
                },
                {
                    ...BugBashViewHeaderCommands.refresh,
                    disabled: isLoading,
                    onActivate: () => {
                        loadBugBashItems(bugBash.id!);
                    }
                }
            ]}
            titleSize={TitleSize.Medium}
        />
    );
}

function onRenderHeaderTitle(bugBash: IBugBash): JSX.Element {
    const currentTime = new Date();
    let statusProps: IStatusProps;
    if (isBugBashCompleted(bugBash, currentTime)) {
        statusProps = {
            text: Resources.Completed,
            ...Statuses.Success
        };
    } else if (isBugBashInProgress(bugBash, currentTime)) {
        statusProps = {
            text: Resources.InProgress,
            ...Statuses.Running
        };
    } else {
        statusProps = {
            text: Resources.Scheduled,
            ...Statuses.Queued
        };
    }

    return (
        <div className="header-breadcrumb flex-row flex-center title-m">
            <Button className="header-breadcrumb-button" subtle={true} onClick={navigateToDirectory}>
                Bug Bashes
            </Button>
            <span className="seperator">></span>
            <span>{bugBash.title}</span>
            <div className="bugbash-header-status flex-column justify-center">
                <Status {...statusProps} size={StatusSize.l} animated={false} />
            </div>
        </div>
    );
}
