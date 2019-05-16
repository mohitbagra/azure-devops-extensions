import "./ChecklistItem.scss";

import { Checkbox } from "azure-devops-ui/Checkbox";
import { Pill, PillSize, PillVariant } from "azure-devops-ui/Pill";
import { PillGroup, PillGroupOverflow } from "azure-devops-ui/PillGroup";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { IBaseProps } from "Common/Components/Contracts";
import { emptyRenderer } from "Common/Components/Renderers";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as format from "date-fns/format";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { ChecklistContext, ChecklistItemStates } from "../../Constants";
import { useChecklistSettings } from "../../Hooks/useChecklistSettings";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistItemState, ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import { IChecklistItemCommonProps } from "../Props";
import * as ChecklistItemContextMenu_Async from "./ChecklistItemContextMenu";

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

const contextMenuLoader = async () => import("./ChecklistItemContextMenu");

export function ChecklistItem(props: IChecklistItemProps) {
    const { checklistItem, checklistType, className, canDeleteItem, canEditItem, canUpdateItemState, index, disableDrag } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { updateChecklistItem } = useActionCreators(Actions);
    const status = useChecklistStatus(idOrType);
    const { wordWrap, hideCompletedItems } = useChecklistSettings();

    const isCompleted = checklistItem.state === ChecklistItemState.Completed;
    const disabled = status !== LoadStatus.Ready;
    const isDragDisabled = disableDrag || disabled;

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

    if (hideCompletedItems && isCompleted) {
        return null;
    }

    return (
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
                        wordWrap && "wrap-text",
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
                    <div className="checklist-item scroll-hidden flex-row flex-center flex-grow">
                        {canUpdateItemState && (
                            <Checkbox
                                className="flex-noshrink"
                                tooltipProps={
                                    isCompleted && checklistItem.completedBy && checklistItem.completedDate
                                        ? {
                                              text: `Completed by ${checklistItem.completedBy.displayName} at ${format(
                                                  checklistItem.completedDate,
                                                  "MMMM DD, YYYY, hh:mm A"
                                              )}`
                                          }
                                        : undefined
                                }
                                disabled={disabled}
                                checked={isCompleted}
                                onChange={onCheckboxChange}
                            />
                        )}

                        {checklistItem.required && <div className="required-item flex-noshrink">*</div>}

                        {checklistItem.state &&
                            checklistItem.state !== ChecklistItemState.Completed &&
                            checklistItem.state !== ChecklistItemState.New && (
                                <Pill
                                    className="checklist-item-state flex-noshrink"
                                    size={PillSize.compact}
                                    variant={PillVariant.colored}
                                    color={ChecklistItemStates[checklistItem.state].color}
                                >
                                    {checklistItem.state}
                                </Pill>
                            )}

                        <Tooltip overflowOnly={true} text={checklistItem.text}>
                            <div className={css("checklist-item-text flex-grow", !wordWrap && "text-ellipsis")}>{checklistItem.text}</div>
                        </Tooltip>

                        <AsyncComponent loader={contextMenuLoader} loadingComponent={emptyRenderer}>
                            {(m: typeof ChecklistItemContextMenu_Async) => {
                                const contextMenuProps = {
                                    checklistItem,
                                    checklistType,
                                    canEditItem,
                                    canDeleteItem,
                                    canUpdateItemState,
                                    className: "flex-noshrink"
                                };
                                return <m.ChecklistItemContextMenu {...contextMenuProps} />;
                            }}
                        </AsyncComponent>
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export function renderLabels(labels: string[]) {
    return (
        <PillGroup className="flex-noshrink checklist-item-labels" overflow={PillGroupOverflow.fade}>
            {(labels || []).map((label, index) => (
                <Pill key={index} size={PillSize.compact}>
                    {label}
                </Pill>
            ))}
        </PillGroup>
    );
}
