import { Button } from "azure-devops-ui/Button";
import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { CustomDialog } from "azure-devops-ui/Components/Dialog/CustomDialog";
import { MoreButton } from "azure-devops-ui/Components/Menu/MoreButton";
import { css, getSafeId } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import { IChecklistItemCommonProps } from "../Props";
import { ChecklistItemEditor } from "./ChecklistItemEditor";

interface IChecklistItemContextMenuProps extends IBaseProps, IChecklistItemCommonProps {
    checklistItem: IChecklistItem;
    checklistType: ChecklistType;
}

const Actions = {
    deleteChecklistItem: ChecklistActions.checklistItemDeleteRequested
};

export function ChecklistItemContextMenu(props: IChecklistItemContextMenuProps) {
    const { checklistItem, checklistType, className, canDeleteItem, canEditItem, canUpdateItemState } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { deleteChecklistItem } = useActionCreators(Actions);
    const status = useChecklistStatus(idOrType);
    const [editorOpen, setEditorOpen] = React.useState(false);

    const disabled = status !== LoadStatus.Ready;

    const onEditorDismiss = React.useCallback(() => {
        setEditorOpen(false);
    }, []);

    const onDeleteClick = React.useCallback(() => {
        if (!disabled && canDeleteItem) {
            confirmAction("Are you sure you want to delete this item?", "", (ok: boolean) => {
                if (ok) {
                    deleteChecklistItem(idOrType, checklistItem.id, checklistType);
                }
            });
        }
    }, [disabled, canDeleteItem, idOrType, checklistItem.id, checklistType]);

    const onEditClick = React.useCallback(() => {
        if (!disabled && canEditItem) {
            setEditorOpen(true);
        }
    }, [disabled, canEditItem]);

    return (
        <div className={css("checklist-item-context-menu", className)}>
            <>
                {editorOpen && (
                    <CustomDialog
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
                    </CustomDialog>
                )}
            </>

            {!canEditItem && !canDeleteItem && (
                <Button
                    subtle={true}
                    iconProps={{ iconName: "Info" }}
                    tooltipProps={{
                        text: "This is a default item. To update or delete it, please go to the settings page by clicking the gear icon above."
                    }}
                />
            )}
            {(canEditItem || canDeleteItem) && (
                <MoreButton
                    disabled={disabled}
                    contextualMenuProps={{
                        menuProps: {
                            id: "checklist-item-context-menu",
                            items: [
                                {
                                    id: "edit",
                                    disabled: disabled || !canEditItem,
                                    onActivate: onEditClick,
                                    iconProps: { iconName: "Edit", className: "communication-foreground" },
                                    text: "Edit"
                                },
                                {
                                    id: "delete",
                                    disabled: disabled || !canDeleteItem,
                                    onActivate: onDeleteClick,
                                    iconProps: { iconName: "Delete", className: "error-text" },
                                    text: "Delete"
                                }
                            ]
                        }
                    }}
                />
            )}
        </div>
    );
}
