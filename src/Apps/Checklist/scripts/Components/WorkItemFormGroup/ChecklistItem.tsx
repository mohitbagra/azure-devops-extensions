import { css } from "azure-devops-ui/Util";
import { IChecklistItem } from "Checklist/Interfaces";
import * as React from "react";

interface IChecklistItemProps {
    checklistItem: IChecklistItem;
    className?: string;
}

export function ChecklistItem(props: IChecklistItemProps) {
    const { checklistItem, className } = props;
    return <div className={css("checklist-item", className)}>{checklistItem.text}</div>;
}
