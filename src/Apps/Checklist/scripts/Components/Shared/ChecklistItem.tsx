import "./ChecklistItem.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import * as CustomDialog_Async from "azure-devops-ui/Dialog";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css, getSafeId } from "azure-devops-ui/Util";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { emptyRenderer } from "Common/Components/Renderers";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { ChecklistContext, ChecklistItemStates } from "../../Constants";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistItemState, ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import { IBaseProps, IChecklistItemCommonProps } from "../Props";
import { ChecklistItemEditor } from "./ChecklistItemEditor";

interface IChecklistItemProps extends IBaseProps, IChecklistItemCommonProps {
    checklistItem: IChecklistItem;
    checklistType: ChecklistType;
    index: number;
    disableDrag?: boolean;
}

const Actions = {
    deleteChecklistItem: ChecklistActions.checklistItemDeleteRequested,
    updateChecklistItem: ChecklistActions.checklistItemUpdateRequested
};

const dialogLoader = async () => import("azure-devops-ui/Dialog");

export function ChecklistItem(props: IChecklistItemProps) {
    const { checklistItem, checklistType, className, canDeleteItem, canEditItem, canUpdateItemState, index, disableDrag } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { deleteChecklistItem, updateChecklistItem } = useActionCreators(Actions);
    const status = useChecklistStatus(idOrType);
    const [editorOpen, setEditorOpen] = React.useState(false);

    const isCompleted = checklistItem.state === ChecklistItemState.Completed;
    const disabled = status !== LoadStatus.Ready;
    const isDragDisabled = disableDrag || disabled;

    const onItemClick = React.useCallback(() => {
        if (!disabled && canUpdateItemState) {
            updateChecklistItem(
                idOrType,
                { ...checklistItem, state: isCompleted ? ChecklistItemState.New : ChecklistItemState.Completed },
                checklistType
            );
        }
    }, [canUpdateItemState, idOrType, disabled, isCompleted, checklistItem, checklistType]);

    const onCheckboxChange = React.useCallback(
        (e: React.FormEvent<HTMLElement | HTMLInputElement>, checked: boolean) => {
            if (!disabled && canUpdateItemState) {
                e.stopPropagation();
                updateChecklistItem(
                    idOrType,
                    { ...checklistItem, state: checked ? ChecklistItemState.Completed : ChecklistItemState.New },
                    checklistType
                );
            }
        },
        [canUpdateItemState, disabled, idOrType, checklistItem, checklistType]
    );

    const onDeleteClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!disabled && canDeleteItem) {
                e.stopPropagation();
                confirmAction("Are you sure you want to delete this item?", "", (ok: boolean) => {
                    if (ok) {
                        deleteChecklistItem(idOrType, checklistItem.id, checklistType);
                    }
                });
            }
        },
        [disabled, canDeleteItem, idOrType, checklistItem.id, checklistType]
    );

    const onEditClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!disabled && canEditItem) {
                e.stopPropagation();
                setEditorOpen(true);
            }
        },
        [disabled, canEditItem]
    );

    const onEditorDismiss = React.useCallback(() => {
        setEditorOpen(false);
    }, []);

    return (
        <>
            {editorOpen && (
                <AsyncComponent loader={dialogLoader} loadingComponent={emptyRenderer}>
                    {(m: typeof CustomDialog_Async) => (
                        <m.CustomDialog
                            onDismiss={onEditorDismiss}
                            defaultActiveElement={`#${getSafeId("checklist-item-text")}`}
                            modal={true}
                            escDismiss={true}
                            contentSize={ContentSize.Small}
                            className="item-editor-dialog"
                        >
                            <ChecklistItemEditor
                                checklistType={checklistType}
                                canUpdateItemState={canUpdateItemState}
                                checklistItem={checklistItem}
                                onDismiss={onEditorDismiss}
                            />
                        </m.CustomDialog>
                    )}
                </AsyncComponent>
            )}
            <Draggable
                draggableId={`item_${checklistItem.id}`}
                key={`item_${checklistItem.id}`}
                type={`checklistItems_${checklistType}`}
                index={index}
                isDragDisabled={isDragDisabled}
            >
                {(provided, snapshot) => (
                    <div
                        className={css(
                            "checklist-item-container scroll-hidden flex-row flex-center",
                            className,
                            isCompleted && "completed",
                            snapshot.isDragging && "is-dragging",
                            isDragDisabled && "drag-disabled"
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                    >
                        {!isDragDisabled && (
                            <div className="drag-handle flex-noshrink" {...provided.dragHandleProps}>
                                <div className="gripper" />
                            </div>
                        )}
                        <div
                            className="checklist-item scroll-hidden flex-row flex-center flex-grow"
                            onClick={canUpdateItemState ? onItemClick : undefined}
                        >
                            {canUpdateItemState && (
                                <Checkbox className="flex-noshrink" disabled={disabled} checked={isCompleted} onChange={onCheckboxChange} />
                            )}

                            {checklistItem.required && <div className="required-item flex-noshrink">*</div>}

                            {checklistItem.state &&
                                checklistItem.state !== ChecklistItemState.Completed &&
                                checklistItem.state !== ChecklistItemState.New && (
                                    <div className={css("checklist-item-state flex-noshrink", ChecklistItemStates[checklistItem.state].className)}>
                                        {checklistItem.state}
                                    </div>
                                )}

                            <Tooltip overflowOnly={true} text={checklistItem.text}>
                                <div className="checklist-item-text flex-grow text-ellipsis">{checklistItem.text}</div>
                            </Tooltip>

                            <div className="flex-noshrink checklist-commandbar">
                                {!canEditItem && !canDeleteItem && (
                                    <Button
                                        subtle={true}
                                        className="checklist-command-item"
                                        iconProps={{ iconName: "Info" }}
                                        tooltipProps={{
                                            text:
                                                "This is a default item. To update or delete it, please go to the settings page by clicking the gear icon above."
                                        }}
                                    />
                                )}
                                {canEditItem && (
                                    <Button
                                        disabled={disabled}
                                        subtle={true}
                                        onClick={onEditClick}
                                        className="checklist-command-item"
                                        iconProps={{ iconName: "Edit" }}
                                        tooltipProps={{ text: "Edit" }}
                                    />
                                )}
                                {canDeleteItem && (
                                    <Button
                                        subtle={true}
                                        disabled={disabled}
                                        onClick={onDeleteClick}
                                        className="checklist-command-item error-item"
                                        iconProps={{ iconName: "Delete" }}
                                        tooltipProps={{ text: "Delete" }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        </>
    );
}
