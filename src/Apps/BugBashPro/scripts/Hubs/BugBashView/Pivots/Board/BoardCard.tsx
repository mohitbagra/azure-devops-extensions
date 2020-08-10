import "./BoardCard.scss";

import * as React from "react";

import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { BugBashViewActions } from "BugBashPro/Hubs/BugBashView//Redux/Actions";
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
import { Draggable } from "react-beautiful-dnd";

import { BugBashViewContext } from "../../Constants";

const Actions = {
    editBugBashItemRequested: BugBashViewActions.editBugBashItemRequested,
    deleteBugBashItem: BugBashItemsActions.bugBashItemDeleteRequested
};

interface IBoardCardProps {
    bugBashItem: IBugBashItem;
    acceptedWorkItem: WorkItem | undefined;
    index: number;
}

export function BoardCard(props: IBoardCardProps) {
    const { bugBashItem, index, acceptedWorkItem } = props;
    const bugBash = React.useContext(BugBashViewContext);
    const bugBashId = bugBash.id as string;

    const { editBugBashItemRequested } = useActionCreators(Actions);
    const isAccepted = isBugBashItemAccepted(bugBashItem) && acceptedWorkItem !== undefined;

    const onTitleClick = React.useCallback(
        (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
            if (!e.ctrlKey) {
                e.preventDefault();
                editBugBashItemRequested(bugBashId, bugBashItem.id!);
            }
        },
        [bugBashId, bugBashItem.id]
    );

    return (
        <Draggable draggableId={`card_${bugBashItem.id}`} key={`card_${bugBashItem.id}`} type="board-card" index={index} isDragDisabled={isAccepted}>
            {(provided) => (
                <div
                    className="board-card scroll-hidden flex-column"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    tabIndex={0}
                >
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
                            <div className="board-card-control font-weight-semibold">
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
                        <div className="board-card-control font-weight-semibold">
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
                            <div className="board-card-control-label flex-noshrink">Created by</div>
                            <IdentityView
                                className="board-card-control-inner scroll-hidden flex-grow"
                                size="extra-extra-small"
                                value={bugBashItem.createdBy}
                            />
                        </div>

                        {!isAccepted && (
                            <div className="board-card-control flex-row flex-center">
                                <div className="board-card-control-label flex-noshrink">Assigned to</div>
                                <TeamView teamId={bugBashItem.teamId} className="board-card-control-inner scroll-hidden flex-grow" />
                            </div>
                        )}
                        {isAccepted && (
                            <div className="board-card-control flex-row flex-center">
                                <div className="board-card-control-label flex-noshrink">Area path</div>
                                <div className="board-card-control-inner text-ellipsis scroll-hidden flex-grow">
                                    {acceptedWorkItem!.fields[CoreFieldRefNames.AreaPath].substr(
                                        acceptedWorkItem!.fields[CoreFieldRefNames.AreaPath].lastIndexOf("\\") + 1
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}

function getBugBashItemUrlPromise(bugBashId: string, bugBashItemId: string): () => Promise<string> {
    return async () => getBugBashItemUrlAsync(bugBashId, bugBashItemId);
}

function getWorkItemUrlPromise(workItemId: number): () => Promise<string> {
    return async () => getWorkItemUrlAsync(workItemId);
}
