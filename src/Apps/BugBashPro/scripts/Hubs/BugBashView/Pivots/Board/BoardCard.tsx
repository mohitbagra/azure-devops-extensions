import "./BoardCard.scss";

import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IBugBashViewBaseProps } from "BugBashPro/Hubs/BugBashView/Interfaces";
import { BugBashPortalActions } from "BugBashPro/Portals/BugBashPortal/Redux/Actions";
import { PortalType } from "BugBashPro/Portals/BugBashPortal/Redux/Contracts";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { getBugBashItemUrlAsync } from "BugBashPro/Shared/NavHelpers";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { TeamView } from "Common/AzDev/Teams/Components/TeamView";
import { WorkItemTitleView } from "Common/AzDev/WorkItemTitleView";
import { AsyncLinkComponent } from "Common/Components/AsyncComponent/AsyncLinkComponent";
import { IdentityView } from "Common/Components/IdentityView";
import { CoreFieldRefNames } from "Common/Constants";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { getWorkItemUrlAsync } from "Common/Utilities/UrlHelper";
import * as React from "react";

const Actions = {
    openPortal: BugBashPortalActions.openPortal,
    deleteBugBashItem: BugBashItemsActions.bugBashItemDeleteRequested
};

interface IBoardCardProps extends IBugBashViewBaseProps {
    bugBashItem: IBugBashItem;
    acceptedWorkItem: WorkItem | undefined;
}

export function BoardCard(props: IBoardCardProps) {
    const { bugBashId, bugBashItem, acceptedWorkItem } = props;
    const { openPortal } = useActionCreators(Actions);
    const isAccepted = isBugBashItemAccepted(bugBashItem) && acceptedWorkItem !== undefined;

    const onTitleClick = React.useCallback(
        (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
            if (!e.ctrlKey) {
                e.preventDefault();
                openPortal(PortalType.BugBashItemEdit, { bugBashId: bugBashId, bugBashItemId: bugBashItem.id, readFromCache: false });
            }
        },
        [bugBashId, bugBashItem.id]
    );

    return (
        <div className="board-card scroll-hidden flex-column">
            {isAccepted && (
                <>
                    <div className="board-card-control">
                        <WorkItemTitleView
                            workItemId={acceptedWorkItem!.id}
                            workItemTypeName={acceptedWorkItem!.fields[CoreFieldRefNames.WorkItemType]}
                            title={acceptedWorkItem!.fields[CoreFieldRefNames.Title]}
                            hideTitle={true}
                        />
                    </div>
                    <div className="board-card-control fontWeightSemiBold">
                        <AsyncLinkComponent
                            key={acceptedWorkItem!.id}
                            getHrefAsync={getWorkItemUrlPromise(acceptedWorkItem!.id)}
                            title={acceptedWorkItem!.fields[CoreFieldRefNames.Title]}
                            onClick={onTitleClick}
                        />
                    </div>
                </>
            )}

            {!isAccepted && (
                <div className="board-card-control fontWeightSemiBold">
                    <AsyncLinkComponent
                        key={bugBashItem.id}
                        getHrefAsync={getBugBashItemUrlPromise(bugBashItem.bugBashId, bugBashItem.id!)}
                        title={bugBashItem.title}
                        onClick={onTitleClick}
                    />
                </div>
            )}

            <div className="board-card-fields">
                <div className="board-card-control flex-row flex-center">
                    <div className="board-card-control-label">Created by</div>
                    <IdentityView className="board-card-control-inner" size="extra-extra-small" value={bugBashItem.createdBy} />
                </div>

                {!isAccepted && (
                    <div className="board-card-control flex-row flex-center">
                        <div className="board-card-control-label">Assigned to</div>
                        <TeamView teamId={bugBashItem.teamId} className="board-card-control-inner" />
                    </div>
                )}
                {isAccepted && (
                    <div className="board-card-control flex-row flex-center">
                        <div className="board-card-control-label">Area path</div>
                        <div className="board-card-control-inner text-ellipsis">
                            {acceptedWorkItem!.fields[CoreFieldRefNames.AreaPath].substr(
                                acceptedWorkItem!.fields[CoreFieldRefNames.AreaPath].lastIndexOf("\\") + 1
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getBugBashItemUrlPromise(bugBashId: string, bugBashItemId: string): () => Promise<string> {
    return async () => getBugBashItemUrlAsync(bugBashId, bugBashItemId);
}

function getWorkItemUrlPromise(workItemId: number): () => Promise<string> {
    return async () => getWorkItemUrlAsync(workItemId);
}
