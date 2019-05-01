import "./ChecklistItem.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { Icon } from "azure-devops-ui/Icon";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistItemState, ChecklistType, IBaseProps, IChecklistItem } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Actions";

interface IChecklistItemProps extends IBaseProps {
    checklistItem: IChecklistItem;
    checklistType: ChecklistType;
}

const Actions = {
    deleteChecklistItem: ChecklistActions.checklistItemDeleteRequested,
    updateChecklistItem: ChecklistActions.checklistItemUpdateRequested
};

export function ChecklistItem(props: IChecklistItemProps) {
    const { checklistItem, checklistType, className } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { deleteChecklistItem, updateChecklistItem } = useActionCreators(Actions);
    const status = useChecklistStatus(idOrType);

    const isCompleted = checklistItem.state === ChecklistItemState.Completed;
    const disabled = status !== LoadStatus.Ready;

    const onItemClick = React.useCallback(() => {
        if (!disabled) {
            updateChecklistItem(
                idOrType,
                { ...checklistItem, state: isCompleted ? ChecklistItemState.New : ChecklistItemState.Completed },
                checklistType
            );
        }
    }, [idOrType, disabled, isCompleted, checklistItem, checklistType]);

    const onCheckboxChange = React.useCallback(
        (e: React.FormEvent<HTMLElement | HTMLInputElement>, checked: boolean) => {
            if (!disabled) {
                e.stopPropagation();
                updateChecklistItem(
                    idOrType,
                    { ...checklistItem, state: checked ? ChecklistItemState.Completed : ChecklistItemState.New },
                    checklistType
                );
            }
        },
        [disabled, idOrType, checklistItem, checklistType]
    );

    const onDeleteClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!disabled) {
                e.stopPropagation();
                deleteChecklistItem(idOrType, checklistItem.id, checklistType);
            }
        },
        [disabled, idOrType, checklistItem.id, checklistType]
    );

    const onEditClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!disabled) {
                e.stopPropagation();
                console.log("edit");
            }
        },
        [disabled, idOrType, checklistItem.id, checklistType]
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
