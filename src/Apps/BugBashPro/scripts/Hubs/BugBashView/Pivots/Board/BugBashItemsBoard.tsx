import "./BugBashItemsBoard.scss";

import * as React from "react";

import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { css } from "azure-devops-ui/Util";
import { IBugBashItemProviderParams } from "BugBashPro/Hubs/BugBashView/Interfaces";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted, isBugBashItemPending, isBugBashItemRejected } from "BugBashPro/Shared/Helpers";
import { DragDropContext, DragStart, Droppable, DropResult } from "react-beautiful-dnd";

import { BoardCard } from "./BoardCard";

export function BugBashItemsBoard(props: IBugBashItemProviderParams) {
    const { filteredBugBashItems, workItemsMap } = props;

    const [draggingFromColumn, setDraggingFromColumn] = React.useState("");
    const pendingItems = filteredBugBashItems.filter((b) => isBugBashItemPending(b));
    const rejectedItems = filteredBugBashItems.filter((b) => isBugBashItemRejected(b));
    const acceptedItems = filteredBugBashItems.filter((b) => isBugBashItemAccepted(b));

    const onDragStart = React.useCallback((start: DragStart) => {
        setDraggingFromColumn(start.source.droppableId);
    }, []);

    const onDragEnd = React.useCallback((result: DropResult) => {
        const { reason, draggableId, source, destination } = result;
        if (reason === "DROP") {
            const sourceId = source.droppableId;
            const targetId = destination && destination.droppableId;
            if (sourceId !== targetId) {
                const bugBashItemId = draggableId.replace("card_", "");
                console.log(bugBashItemId);
                // if (targetId === "pending") {
                // } else if (targetId === "rejected") {
                // } else {
                // }
            }
        }
    }, []);

    const renderCard = React.useCallback(
        (bugBashItem: IBugBashItem, index: number) => {
            let acceptedWorkItem: WorkItem | undefined;
            if (isBugBashItemAccepted(bugBashItem) && workItemsMap) {
                acceptedWorkItem = workItemsMap[bugBashItem.workItemId!];
            }
            return <BoardCard key={bugBashItem.id} index={index} bugBashItem={bugBashItem} acceptedWorkItem={acceptedWorkItem} />;
        },
        [workItemsMap]
    );

    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <div className="board scroll-hidden flex-grow flex-column">
                <div className="board-header depth-4 flex-noshrink flex-row">
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
                    <div className="board-contents flex-row">
                        <Droppable
                            droppableId="pending"
                            key="pending"
                            direction="vertical"
                            type="board-column"
                            isDropDisabled={draggingFromColumn === "pending"}
                        >
                            {(provided, snapshot) => (
                                <div
                                    className={css("board-contents-cell", snapshot.isDraggingOver && "cell--hovered")}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {pendingItems.map(renderCard)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <Droppable
                            droppableId="rejected"
                            key="rejected"
                            direction="vertical"
                            type="board-column"
                            isDropDisabled={draggingFromColumn === "rejected"}
                        >
                            {(provided, snapshot) => (
                                <div
                                    className={css("board-contents-cell", snapshot.isDraggingOver && "cell--hovered")}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {rejectedItems.map(renderCard)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <Droppable droppableId="accepted" key="accepted" direction="vertical" type="board-column">
                            {(provided, snapshot) => (
                                <div
                                    className={css("board-contents-cell", snapshot.isDraggingOver && "cell--hovered")}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {acceptedItems.map(renderCard)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            </div>
        </DragDropContext>
    );
}
