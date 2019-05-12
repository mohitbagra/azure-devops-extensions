import "./ChecklistItemEditor.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { IMenuItem, MenuButton } from "azure-devops-ui/Menu";
import { css, KeyCode } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { TextField } from "Common/Components/TextField";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";
import { ChecklistContext, ChecklistItemStates } from "../../Constants";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistItemState, ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import { ChecklistLabelPicker } from "./ChecklistLabelPicker";

interface IChecklistItemEditorProps extends IBaseProps {
    checklistItem?: IChecklistItem;
    checklistType: ChecklistType;
    canUpdateItemState?: boolean;
    onDismiss?: () => void;
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
    const { checklistItem, checklistType, className, canUpdateItemState, onDismiss } = props;
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
            if (onDismiss) {
                onDismiss();
            }
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

    const onTextChanged = React.useCallback(
        (text: string) => {
            if (!disabled) {
                updateDraftChecklistItem({ ...draftChecklistItem, text });
            }
        },
        [disabled, draftChecklistItem]
    );

    const onRequiredChanged = React.useCallback(
        (_ev: React.FormEvent<HTMLElement | HTMLInputElement>, required: boolean) => {
            if (!disabled) {
                updateDraftChecklistItem({ ...draftChecklistItem, required });
            }
        },
        [disabled, draftChecklistItem]
    );

    const onStateChanged = React.useCallback(
        (menuItem: IMenuItem) => {
            if (!disabled) {
                updateDraftChecklistItem({ ...draftChecklistItem, state: menuItem.id as ChecklistItemState });
            }
        },
        [disabled, draftChecklistItem]
    );

    const onLabelsChanged = React.useCallback(
        (labels: string[]) => {
            if (!disabled) {
                updateDraftChecklistItem({ ...draftChecklistItem, labels });
            }
        },
        [disabled, draftChecklistItem]
    );

    return (
        <div className={css("checklist-item-editor flex-column", className)}>
            <div className="checklist-item-input">
                <TextField
                    inputId="checklist-item-text"
                    placeholder="Add new item"
                    maxLength={128}
                    onKeyUp={onInputKeyUp}
                    disabled={disabled}
                    value={draftChecklistItem.text}
                    onChange={onTextChanged}
                />
            </div>
            {draftChecklistItem.id && (
                <ChecklistLabelPicker
                    className="checklist-label-picker"
                    disabled={disabled}
                    values={draftChecklistItem.labels}
                    onSelectionChanged={onLabelsChanged}
                />
            )}
            <div className="checklist-item-props flex-row flex-center">
                <Checkbox
                    className="flex-grow"
                    disabled={disabled}
                    checked={!!draftChecklistItem.required}
                    onChange={onRequiredChanged}
                    label="Mandatory?"
                />
                {canUpdateItemState && (
                    <MenuButton
                        className={css("checklist-item-state-control", checklistItemState.className)}
                        text={checklistItemState.name}
                        disabled={disabled}
                        contextualMenuProps={{
                            onActivate: onStateChanged,
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
                <div className="flex-row flex-center">
                    <Button
                        className="communication-foreground checklist-command-item"
                        subtle={true}
                        onClick={onSave}
                        disabled={isNullOrWhiteSpace(draftChecklistItem.text) || draftChecklistItem.text.length > 128 || disabled}
                        iconProps={{ iconName: "CompletedSolid" }}
                        tooltipProps={{ text: "Save" }}
                    />
                    <Button
                        className="error-text checklist-command-item"
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
