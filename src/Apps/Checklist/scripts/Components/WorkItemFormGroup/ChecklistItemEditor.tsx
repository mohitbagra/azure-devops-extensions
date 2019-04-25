import "./ChecklistItemEditor.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { KeyCode } from "azure-devops-ui/Util";
import { WorkItemChecklistContext } from "Checklist/Constants";
import { IChecklistItem } from "Checklist/Interfaces";
import { WorkItemChecklistActions } from "Checklist/Redux/WorkItemChecklist/Actions";
import { TextField } from "Common/Components/TextField";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";

interface IChecklistItemEditorProps {
    checklistItem?: IChecklistItem;
    disabled?: boolean;
}

const newChecklistItem: IChecklistItem = {
    id: "",
    text: "",
    required: true
};

const Actions = {
    createChecklistItem: WorkItemChecklistActions.workItemChecklistItemCreateRequested,
    updateChecklistItem: WorkItemChecklistActions.workItemChecklistItemUpdateRequested
};

export function ChecklistItemEditor(props: IChecklistItemEditorProps) {
    const { checklistItem, disabled } = props;
    const workItemId = React.useContext(WorkItemChecklistContext);
    const [draftChecklistItem, updateDraftChecklistItem] = React.useState<IChecklistItem>(
        checklistItem ? { ...checklistItem } : { ...newChecklistItem }
    );
    const { createChecklistItem, updateChecklistItem } = useActionCreators(Actions);

    const cancelEdit = React.useCallback(() => {
        updateDraftChecklistItem(checklistItem ? { ...checklistItem } : { ...newChecklistItem });
    }, [checklistItem]);

    const onSave = React.useCallback(() => {
        if (!isNullOrWhiteSpace(draftChecklistItem.text)) {
            if (draftChecklistItem.id) {
                updateChecklistItem(workItemId, draftChecklistItem);
            } else {
                createChecklistItem(workItemId, draftChecklistItem);
            }
            cancelEdit();
        }
    }, [draftChecklistItem, workItemId]);

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
                        disabled={isNullOrWhiteSpace(draftChecklistItem.text) || disabled}
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
