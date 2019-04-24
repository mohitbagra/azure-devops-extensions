import "./ChecklistItemEditor.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { TextField } from "Common/Components/TextField";
import * as React from "react";

export function ChecklistItemEditor() {
    return (
        <div className="checklist-item-editor flex-column">
            <div className="checklist-item-input">
                <TextField placeholder="Add new item" />
            </div>
            <div className="checklist-item-props flex-row flex-center">
                <Checkbox className="flex-grow" checked={true} label="Mandatory?" />
                <div className="checklist-commandbar">
                    <Button
                        className="checklist-command-item"
                        subtle={true}
                        iconProps={{ iconName: "CompletedSolid" }}
                        tooltipProps={{ text: "Save" }}
                    />
                    <Button
                        className="checklist-command-item error-item"
                        subtle={true}
                        iconProps={{ iconName: "StatusErrorFull" }}
                        tooltipProps={{ text: "Cancel" }}
                    />
                </div>
            </div>
        </div>
    );
}
