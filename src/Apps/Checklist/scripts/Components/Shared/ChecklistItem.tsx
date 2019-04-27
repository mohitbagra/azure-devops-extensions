import "./ChecklistItem.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { Icon } from "azure-devops-ui/Icon";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { ChecklistContext } from "Checklist/Constants";
import { ChecklistItemState, ChecklistType, IChecklistItem } from "Checklist/Interfaces";
import { ChecklistActions } from "Checklist/Redux/Actions";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";

interface IChecklistItemProps {
    checklistItem: IChecklistItem;
    checklistType: ChecklistType;
    disabled?: boolean;
    className?: string;
}

const Actions = {
    deleteChecklistItem: ChecklistActions.checklistItemDeleteRequested,
    updateChecklistItem: ChecklistActions.checklistItemUpdateRequested
};

export function ChecklistItem(props: IChecklistItemProps) {
    const { checklistItem, checklistType, className, disabled } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { deleteChecklistItem, updateChecklistItem } = useActionCreators(Actions);
    const isCompleted = checklistItem.state === ChecklistItemState.Completed;

    const onItemClick = React.useCallback(() => {
        if (!disabled) {
            updateChecklistItem(
                idOrType,
                { ...checklistItem, state: isCompleted ? ChecklistItemState.New : ChecklistItemState.Completed },
                checklistType
            );
        }
    }, [idOrType, disabled, isCompleted, checklistItem]);

    const onCheckboxChange = React.useCallback(
        (e: React.FormEvent<HTMLElement | HTMLInputElement>, checked: boolean) => {
            e.stopPropagation();
            updateChecklistItem(
                idOrType,
                { ...checklistItem, state: checked ? ChecklistItemState.Completed : ChecklistItemState.New },
                checklistType
            );
        },
        [idOrType, checklistItem]
    );

    const onDeleteClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            deleteChecklistItem(idOrType, checklistItem.id, checklistType);
        },
        [idOrType, checklistItem.id]
    );

    const onEditClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            console.log("edit");
        },
        [idOrType, isCompleted, checklistItem]
    );

    return (
        <div className={css("checklist-item-container scroll-hidden flex-row flex-center", className, isCompleted && "completed")}>
            <Icon className="drag-handle flex-noshrink" iconName="Cancel" />
            <div className="checklist-item scroll-hidden flex-row flex-center flex-grow" onClick={onItemClick}>
                <Checkbox className="flex-noshrink" disabled={disabled} checked={isCompleted} onChange={onCheckboxChange} />
                {checklistItem.required && <div className="required-item">*</div>}
                <Tooltip overflowOnly={true} text={checklistItem.text}>
                    <div className="checklist-item-text flex-grow text-ellipsis">{checklistItem.text}</div>
                </Tooltip>
                <div className="flex-noshrink checklist-commandbar">
                    <Button
                        disabled={disabled}
                        subtle={true}
                        onClick={onEditClick}
                        className="checklist-command-item "
                        iconProps={{ iconName: "Edit" }}
                        tooltipProps={{ text: "Edit" }}
                    />
                    <Button
                        subtle={true}
                        disabled={disabled}
                        onClick={onDeleteClick}
                        className="checklist-command-item error-item"
                        iconProps={{ iconName: "Delete" }}
                        tooltipProps={{ text: "Delete" }}
                    />
                </div>
            </div>
        </div>
    );
}
