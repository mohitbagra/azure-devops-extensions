import "./BugBashItemsBoard.scss";

import { IBugBashItemProviderParams, IBugBashViewBaseProps } from "BugBashPro/Hubs/BugBashView/Interfaces";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted, isBugBashItemPending, isBugBashItemRejected } from "BugBashPro/Shared/Helpers";
import * as React from "react";
import { BoardCard } from "./BoardCard";

export function BugBashItemsBoard(props: IBugBashViewBaseProps & IBugBashItemProviderParams) {
    const { filteredBugBashItems } = props;

    const pendingItems = filteredBugBashItems.filter(b => isBugBashItemPending(b));
    const rejectedItems = filteredBugBashItems.filter(b => isBugBashItemRejected(b));
    const acceptedItems = filteredBugBashItems.filter(b => isBugBashItemAccepted(b));

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

function renderCard(bugBashItem: IBugBashItem): JSX.Element {
    return <BoardCard bugBashItem={bugBashItem} />;
}
