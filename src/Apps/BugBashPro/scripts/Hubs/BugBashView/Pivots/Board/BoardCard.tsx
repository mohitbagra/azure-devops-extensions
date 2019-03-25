import "./BoardCard.scss";

import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IBugBashViewBaseProps } from "BugBashPro/Hubs/BugBashView/Interfaces";
import { BugBashItemEditorPortalActions } from "BugBashPro/Portals/BugBashItemEditorPortal/Redux/Actions";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { getBugBashItemUrlAsync } from "BugBashPro/Shared/NavHelpers";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { WorkItemTypeIcon } from "Common/AzDev/WorkItemTypes/Components/WorkItemTypeIcon";
import { AsyncLinkComponent } from "Common/Components/AsyncComponent/AsyncLinkComponent";
import { CoreFieldRefNames } from "Common/Constants";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { getWorkItemUrlAsync } from "Common/Utilities/UrlHelper";
import * as React from "react";

const Actions = {
    openEditorPanel: BugBashItemEditorPortalActions.openPortal,
    deleteBugBashItem: BugBashItemsActions.bugBashItemDeleteRequested
};

interface IBoardCardProps extends IBugBashViewBaseProps {
    bugBashItem: IBugBashItem;
    acceptedWorkItem: WorkItem | undefined;
}

export function BoardCard(props: IBoardCardProps) {
    const { bugBash, bugBashItem, acceptedWorkItem } = props;
    const { openEditorPanel } = useActionCreators(Actions);
    const isAccepted = isBugBashItemAccepted(bugBashItem) && acceptedWorkItem !== undefined;

    const onTitleClick = React.useCallback(
        (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
            if (!e.ctrlKey) {
                e.preventDefault();
                openEditorPanel(bugBash, bugBashItem.id!);
            }
        },
        [bugBash, bugBashItem.id]
    );

    return (
        <div className="board-card scroll-hidden flex-column">
            <div className="card-title fontWeightSemiBold">
                {isAccepted && (
                    <>
                        <div className="flex flex-center">
                            <WorkItemTypeIcon workItemTypeName={acceptedWorkItem!.fields[CoreFieldRefNames.WorkItemType]} />
                            <div style={{ marginLeft: 5 }}>{acceptedWorkItem!.id}</div>
                        </div>
                        <div style={{ marginTop: 5 }}>
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
                    <AsyncLinkComponent
                        key={bugBashItem.id}
                        getHrefAsync={getBugBashItemUrlPromise(bugBashItem.bugBashId, bugBashItem.id!)}
                        title={bugBashItem.title}
                        onClick={onTitleClick}
                    />
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
