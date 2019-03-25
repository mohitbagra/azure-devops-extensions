import "./BugBashItemsBoard.scss";

import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { useBugBashViewMode } from "BugBashPro/Hubs/BugBashView/Hooks/useBugBashViewMode";
import { IBugBashItemProviderParams, IBugBashViewBaseProps } from "BugBashPro/Hubs/BugBashView/Interfaces";
import { BugBashViewMode } from "BugBashPro/Hubs/BugBashView/Redux/Contracts";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted, isBugBashItemPending, isBugBashItemRejected } from "BugBashPro/Shared/Helpers";
import * as React from "react";
import { BoardCard } from "./BoardCard";

export function BugBashItemsBoard(props: IBugBashViewBaseProps & IBugBashItemProviderParams) {
    const { bugBash, filteredBugBashItems, workItemsMap } = props;
    const { viewMode, setViewMode } = useBugBashViewMode();

    React.useEffect(() => {
        if (viewMode !== BugBashViewMode.All) {
            setViewMode(BugBashViewMode.All);
        }
    }, []);

    const pendingItems = filteredBugBashItems.filter(b => isBugBashItemPending(b));
    const rejectedItems = filteredBugBashItems.filter(b => isBugBashItemRejected(b));
    const acceptedItems = filteredBugBashItems.filter(b => isBugBashItemAccepted(b));

    const renderCard = React.useCallback(
        (bugBashItem: IBugBashItem) => {
            let acceptedWorkItem: WorkItem | undefined;
            if (isBugBashItemAccepted(bugBashItem) && workItemsMap) {
                acceptedWorkItem = workItemsMap[bugBashItem.workItemId!];
            }
            return <BoardCard key={bugBashItem.id} bugBashItem={bugBashItem} acceptedWorkItem={acceptedWorkItem} bugBash={bugBash} />;
        },
        [bugBash, workItemsMap]
    );

    if (viewMode !== BugBashViewMode.All) {
        return null;
    }

    return (
        <div className="board scroll-hidden flex-grow flex-column">
            <div className="board-header depth-4 flex-noshrink flex">
                <div className="board-header-cell">
                    <div className="board-header-cell-content">Pending</div>
                </div>
                <div className="board-header-cell">
                    <div className="board-header-cell-content">Rejected</div>
                </div>
                <div className="board-header-cell">
                    <div className="board-header-cell-content">Accepted</div>
                </div>
            </div>
            <div className="board-contents-outer flex-grow v-scroll-auto">
                <div className="board-contents flex">
                    <div className="board-contents-cell">{pendingItems.map(renderCard)}</div>
                    <div className="board-contents-cell">{rejectedItems.map(renderCard)}</div>
                    <div className="board-contents-cell">{acceptedItems.map(renderCard)}</div>
                </div>
            </div>
        </div>
    );
}
