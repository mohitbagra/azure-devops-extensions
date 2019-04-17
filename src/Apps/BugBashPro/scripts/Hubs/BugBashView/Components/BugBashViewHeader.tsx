import { Button } from "azure-devops-ui/Button";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { BugBashPortalActions } from "BugBashPro/Portals/BugBashPortal/Redux/Actions";
import { Resources } from "BugBashPro/Resources";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { isBugBashCompleted, isBugBashInProgress } from "BugBashPro/Shared/Helpers";
import { navigateToDirectory } from "BugBashPro/Shared/NavHelpers";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { BugBashViewContext, BugBashViewHeaderCommands } from "../Constants";
import { useFilteredBugBashItems } from "../Hooks/useFilteredBugBashItems";

const Actions = {
    openBugBashPortal: BugBashPortalActions.openBugBashPortal,
    openBugBashItemPortal: BugBashPortalActions.openBugBashItemPortal,
    openDetailsPortal: BugBashPortalActions.openDetailsPortal,
    loadBugBashItems: BugBashItemsActions.bugBashItemsLoadRequested
};

export function BugBashViewHeader() {
    const bugBash = React.useContext(BugBashViewContext);
    const bugBashId = bugBash.id as string;
    const { status } = useFilteredBugBashItems(bugBashId);
    const { openBugBashPortal, openBugBashItemPortal, openDetailsPortal, loadBugBashItems } = useActionCreators(Actions);

    if (!bugBash) {
        throw new Error("Bug Bash is not initialized yet");
    }

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
                        openBugBashItemPortal(bugBashId, undefined);
                    }
                },
                {
                    ...BugBashViewHeaderCommands.edit,
                    disabled: isLoading,
                    onActivate: () => {
                        // dont refresh bug bash from server when editing from inside of bug bash view
                        openBugBashPortal(bugBashId, { readFromCache: true });
                    }
                },
                {
                    ...BugBashViewHeaderCommands.details,
                    disabled: isLoading,
                    onActivate: () => {
                        openDetailsPortal(bugBashId);
                    }
                },
                {
                    ...BugBashViewHeaderCommands.refresh,
                    disabled: isLoading,
                    onActivate: () => {
                        loadBugBashItems(bugBashId);
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
