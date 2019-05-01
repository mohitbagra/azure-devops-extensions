import "./ChecklistView.scss";

import { css } from "azure-devops-ui/Util";
import * as React from "react";
import { ChecklistType, IBaseProps, IChecklistItem } from "../../Interfaces";
import { ChecklistItem } from "./ChecklistItem";

interface IChecklistViewProps extends IBaseProps {
    checklistItems: IChecklistItem[];
    checklistType: ChecklistType;
}

export function ChecklistView(props: IChecklistViewProps) {
    const { checklistItems, checklistType, className } = props;

    return (
        <div className={css("checklist-view flex-column", className)}>
            {checklistItems.map((checklistItem: IChecklistItem) => (
                <ChecklistItem key={`checklist_${checklistItem.id}`} checklistItem={checklistItem} checklistType={checklistType} />
            ))}
        </div>
    );
}
