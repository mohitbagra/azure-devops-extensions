import "./ChecklistItemEditor.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { KeyCode } from "azure-devops-ui/Util";
import { ChecklistContext } from "Checklist/Constants";
import { ChecklistType, IChecklistItem } from "Checklist/Interfaces";
import { ChecklistActions } from "Checklist/Redux/Actions";
import { TextField } from "Common/Components/TextField";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";

interface IChecklistItemEditorProps {
    checklistItem?: IChecklistItem;
    checklistType: ChecklistType;
    disabled?: boolean;
    autoFocus?: boolean;
}

const newChecklistItem: IChecklistItem = {
    id: "",
    text: "",
    required: true
};

const Actions = {
    createChecklistItem: ChecklistActions.checklistItemCreateRequested,
    updateChecklistItem: ChecklistActions.checklistItemUpdateRequested
};

export function ChecklistItemEditor(props: IChecklistItemEditorProps) {
    const { checklistItem, disabled, autoFocus, checklistType } = props;
    const idOrType = React.useContext(ChecklistContext);
    const [draftChecklistItem, updateDraftChecklistItem] = React.useState<IChecklistItem>(
        checklistItem ? { ...checklistItem } : { ...newChecklistItem }
    );
    const { createChecklistItem, updateChecklistItem } = useActionCreators(Actions);

    const cancelEdit = React.useCallback(() => {
        updateDraftChecklistItem(checklistItem ? { ...checklistItem } : { ...newChecklistItem });
    }, [checklistItem]);

    const onSave = React.useCallback(() => {
        if (!isNullOrWhiteSpace(draftChecklistItem.text) && draftChecklistItem.text.length <= 128) {
            if (draftChecklistItem.id) {
                updateChecklistItem(idOrType, draftChecklistItem, checklistType);
            } else {
                createChecklistItem(idOrType, draftChecklistItem, checklistType);
            }
            cancelEdit();
        }
    }, [draftChecklistItem, idOrType]);

    const onInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.keyCode === KeyCode.enter) {
            e.preventDefault();
            e.stopPropagation();
            onSave();
        } else if (e.keyCode === KeyCode.escape) {
            e.preventDefault();
            e.stopPropagation();
            cancelEdit();
        }
    };

    const onTextChange = React.useCallback(
        (newText: string) => {
            updateDraftChecklistItem({ ...draftChecklistItem, text: newText });
        },
        [draftChecklistItem]
    );

    const onRequiredChange = React.useCallback(
        (_ev: React.FormEvent<HTMLElement | HTMLInputElement>, checked: boolean) => {
            updateDraftChecklistItem({ ...draftChecklistItem, required: checked });
        },
        [draftChecklistItem]
    );

    return (
        <div className="checklist-item-editor flex-column">
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
