import "./ChecklistItemEditor.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { IMenuItem, MenuButton } from "azure-devops-ui/Menu";
import { css, KeyCode } from "azure-devops-ui/Util";
import { TextField } from "Common/Components/TextField";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";
import { ChecklistContext, ChecklistItemStates } from "../../Constants";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistItemState, ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Actions";
import { IBaseProps } from "../Props";

interface IChecklistItemEditorProps extends IBaseProps {
    checklistItem?: IChecklistItem;
    checklistType: ChecklistType;
    autoFocus?: boolean;
    canUpdateItemState?: boolean;
}

const newChecklistItem: IChecklistItem = {
    id: "",
    text: "",
    required: true,
    state: ChecklistItemState.New
};

const Actions = {
    createChecklistItem: ChecklistActions.checklistItemCreateRequested,
    updateChecklistItem: ChecklistActions.checklistItemUpdateRequested
};

export function ChecklistItemEditor(props: IChecklistItemEditorProps) {
    const { checklistItem, autoFocus, checklistType, className, canUpdateItemState } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { createChecklistItem, updateChecklistItem } = useActionCreators(Actions);
    const status = useChecklistStatus(idOrType);

    const [draftChecklistItem, updateDraftChecklistItem] = React.useState<IChecklistItem>(
        checklistItem ? { ...checklistItem } : { ...newChecklistItem }
    );

    const disabled = status !== LoadStatus.Ready;
    const checklistItemState = ChecklistItemStates[draftChecklistItem.state];

    const cancelEdit = React.useCallback(() => {
        if (!disabled) {
            updateDraftChecklistItem(checklistItem ? { ...checklistItem } : { ...newChecklistItem });
        }
    }, [disabled, checklistItem]);

    const onSave = React.useCallback(() => {
        if (!disabled && !isNullOrWhiteSpace(draftChecklistItem.text) && draftChecklistItem.text.length <= 128) {
            if (draftChecklistItem.id) {
                updateChecklistItem(idOrType, draftChecklistItem, checklistType);
            } else {
                createChecklistItem(idOrType, draftChecklistItem, checklistType);
            }
            cancelEdit();
        }
    }, [disabled, draftChecklistItem, idOrType, checklistType]);

    const onInputKeyUp = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (!disabled) {
                if (e.keyCode === KeyCode.enter) {
                    e.preventDefault();
                    e.stopPropagation();
                    onSave();
                } else if (e.keyCode === KeyCode.escape) {
                    e.preventDefault();
                    e.stopPropagation();
                    cancelEdit();
                }
            }
        },
        [disabled, onSave, cancelEdit]
    );

    const onTextChange = React.useCallback(
        (newText: string) => {
            if (!disabled) {
                updateDraftChecklistItem({ ...draftChecklistItem, text: newText });
            }
        },
        [disabled, draftChecklistItem]
    );

    const onRequiredChange = React.useCallback(
        (_ev: React.FormEvent<HTMLElement | HTMLInputElement>, checked: boolean) => {
            if (!disabled) {
                updateDraftChecklistItem({ ...draftChecklistItem, required: checked });
            }
        },
        [disabled, draftChecklistItem]
    );

    const onChangeState = React.useCallback(
        (menuItem: IMenuItem) => {
            if (!disabled) {
                updateDraftChecklistItem({ ...draftChecklistItem, state: menuItem.id as ChecklistItemState });
            }
        },
        [disabled, draftChecklistItem]
    );

    return (
        <div className={css("checklist-item-editor flex-column", className)}>
            <div className="checklist-item-input">
                <TextField
                    placeholder="Add new item"
                    autoFocus={autoFocus}
                    maxLength={128}
                    onKeyUp={onInputKeyUp}
                    disabled={disabled}
                    value={draftChecklistItem.text}
                    onChange={onTextChange}
                />
            </div>
            <div className="checklist-item-props flex-row flex-center">
                <Checkbox
                    className="flex-grow"
                    disabled={disabled}
                    checked={!!draftChecklistItem.required}
                    onChange={onRequiredChange}
                    label="Mandatory?"
                />
                {canUpdateItemState && (
                    <MenuButton
                        className={css("checklist-item-state-control", checklistItemState.className)}
                        text={checklistItemState.name}
                        disabled={disabled}
                        contextualMenuProps={{
                            onActivate: onChangeState,
                            menuProps: {
                                id: "test",
                                items: Object.keys(ChecklistItemStates).map(state => ({
                                    id: ChecklistItemStates[state].name,
                                    text: ChecklistItemStates[state].name
                                }))
                            }
                        }}
                    />
                )}
                <div className="checklist-commandbar">
                    <Button
                        className="checklist-command-item"
                        subtle={true}
                        onClick={onSave}
                        disabled={isNullOrWhiteSpace(draftChecklistItem.text) || draftChecklistItem.text.length > 128 || disabled}
                        iconProps={{ iconName: "CompletedSolid" }}
                        tooltipProps={{ text: "Save" }}
                    />
                    <Button
                        className="checklist-command-item error-item"
                        subtle={true}
                        disabled={disabled}
                        onClick={cancelEdit}
                        iconProps={{ iconName: "StatusErrorFull" }}
                        tooltipProps={{ text: "Cancel" }}
                    />
                </div>
            </div>
        </div>
    );
}
