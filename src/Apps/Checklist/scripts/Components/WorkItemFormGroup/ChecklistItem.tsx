import { IChecklistItem } from "Checklist/Interfaces";
import * as React from "react";

interface IChecklistItemProps {
    checklistItem: IChecklistItem;
}

export function ChecklistItem(props: IChecklistItemProps) {
    const { checklistItem } = props;
    return <>{checklistItem.text}</>;
}
