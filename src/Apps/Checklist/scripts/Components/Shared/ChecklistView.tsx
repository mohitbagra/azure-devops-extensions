import "./ChecklistView.scss";

import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { ChecklistContext } from "../../Constants";
import { ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import { IChecklistItemCommonProps } from "../Props";
import { ChecklistItem } from "./ChecklistItem";

interface IChecklistViewProps extends IBaseProps {
    checklistItems: IChecklistItem[];
    checklistType: ChecklistType;
    disableDragDrop?: boolean;
    itemProps: IChecklistItemCommonProps;
}

const Actions = {
    reorderChecklistItem: ChecklistActions.checklistItemReorderRequested
};

export function ChecklistView(props: IChecklistViewProps) {
    const { checklistItems, checklistType, className, itemProps, disableDragDrop } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { reorderChecklistItem } = useActionCreators(Actions);

    const onDragEnd = React.useCallback(
        (result: DropResult) => {
            const { reason, draggableId, source, destination } = result;
            if (reason === "DROP" && destination && source.droppableId === destination.droppableId) {
                const newIndex = destination.index;
                const checklistItemId = draggableId.replace("item_", "");
                reorderChecklistItem(idOrType, checklistItemId, checklistType, newIndex);
            }
        },
        [idOrType, checklistType]
    );

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
