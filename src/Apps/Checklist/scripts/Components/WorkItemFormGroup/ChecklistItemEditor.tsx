import "./ChecklistItemEditor.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { WorkItemChecklistContext } from "Checklist/Constants";
import { useWorkItemChecklist } from "Checklist/Hooks/useWorkItemChecklist";
import { IChecklistItem } from "Checklist/Interfaces";
import { WorkItemChecklistActions } from "Checklist/Redux/WorkItemChecklist/Actions";
import { TextField } from "Common/Components/TextField";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";

interface IChecklistItemEditorProps {
    checklistItem?: IChecklistItem;
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
    const { checklistItem } = props;
    const workItemId = React.useContext(WorkItemChecklistContext);
    const [draftChecklistItem, updateDraftChecklistItem] = React.useState<IChecklistItem>(
        checklistItem ? { ...checklistItem } : { ...newChecklistItem }
    );
    const { createChecklistItem, updateChecklistItem } = useActionCreators(Actions);
    const { status } = useWorkItemChecklist(workItemId, false);

    const cancelEdit = React.useCallback(() => {
        updateDraftChecklistItem(checklistItem ? { ...checklistItem } : { ...newChecklistItem });
    }, [checklistItem]);

    const onSave = React.useCallback(() => {
        if (draftChecklistItem.id) {
            updateChecklistItem(workItemId, draftChecklistItem);
        } else {
            createChecklistItem(workItemId, draftChecklistItem);
        }
        cancelEdit();
    }, [draftChecklistItem, workItemId]);

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

    const isLoading = status === LoadStatus.Loading || status === LoadStatus.Updating || status === LoadStatus.UpdateFailed;

    return (
        <div className="checklist-item-editor flex-column">
            <div className="checklist-item-input">
                <TextField placeholder="Add new item" disabled={isLoading} value={draftChecklistItem.text} onChange={onTextChange} />
            </div>
            <div className="checklist-item-props flex-row flex-center">
                <Checkbox
                    className="flex-grow"
                    disabled={isLoading}
                    checked={!!draftChecklistItem.required}
                    onChange={onRequiredChange}
                    label="Mandatory?"
                />
                <div className="checklist-commandbar">
                    <Button
                        className="checklist-command-item"
                        subtle={true}
                        onClick={onSave}
                        disabled={isNullOrWhiteSpace(draftChecklistItem.text) || isLoading}
                        iconProps={{ iconName: "CompletedSolid" }}
                        tooltipProps={{ text: "Save" }}
                    />
                    <Button
                        className="checklist-command-item error-item"
                        subtle={true}
                        onClick={cancelEdit}
                        iconProps={{ iconName: "StatusErrorFull" }}
                        tooltipProps={{ text: "Cancel" }}
                    />
                </div>
            </div>
        </div>
    );
}
