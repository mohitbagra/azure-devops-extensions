import "./ChecklistView.scss";

import { css } from "azure-devops-ui/Util";
import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { ChecklistType, IChecklistItem } from "../../Interfaces";
import { IBaseProps, IChecklistItemCommonProps } from "../Props";
import { ChecklistItem } from "./ChecklistItem";

interface IChecklistViewProps extends IBaseProps {
    checklistItems: IChecklistItem[];
    checklistType: ChecklistType;
    disableDragDrop?: boolean;
    itemProps: IChecklistItemCommonProps;
}

export function ChecklistView(props: IChecklistViewProps) {
    const { checklistItems, checklistType, className, itemProps, disableDragDrop } = props;

    const onDragEnd = React.useCallback((result: DropResult) => {
        const { reason, draggableId, source, destination } = result;
        if (reason === "DROP") {
            const sourceId = source.droppableId;
            const targetId = destination && destination.droppableId;
            if (sourceId !== targetId) {
                const bugBashItemId = draggableId.replace("card_", "");
                console.log(bugBashItemId);
                if (targetId === "pending") {
                } else if (targetId === "rejected") {
                } else {
                }
            }
        }
    }, []);

    const isDragDropDisabled = disableDragDrop || checklistItems.length <= 1;

    const renderChecklistItem = React.useCallback(
        (checklistItem: IChecklistItem, index: number) => {
            return (
                <ChecklistItem
                    key={`checklist_${checklistItem.id}`}
                    checklistItem={checklistItem}
                    checklistType={checklistType}
                    index={index}
                    disableDrag={isDragDropDisabled}
                    {...itemProps}
                />
            );
        },
        [checklistType, isDragDropDisabled, itemProps]
    );

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
                droppableId={`checklistItems_${checklistType}`}
                key={`checklistItems_${checklistType}`}
                direction="vertical"
                type={`checklistItems_${checklistType}`}
                isDropDisabled={isDragDropDisabled}
            >
                {(provided, snapshot) => (
                    <div
                        className={css("checklist-view flex-column", className, snapshot.isDraggingOver && "cell--hovered")}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {checklistItems.map(renderChecklistItem)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
