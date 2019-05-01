import "./ChecklistView.scss";

import { css } from "azure-devops-ui/Util";
import * as React from "react";
import { ChecklistType, IChecklistItem } from "../../Interfaces";
import { IBaseProps, IChecklistItemCommonProps } from "../Props";
import { ChecklistItem } from "./ChecklistItem";

interface IChecklistViewProps extends IBaseProps {
    checklistItems: IChecklistItem[];
    checklistType: ChecklistType;
    disableDragDrop?: boolean;
    itemProps: IChecklistItemCommonProps;
}

export function ChecklistView(props: IChecklistViewProps) {
    const { checklistItems, checklistType, className, itemProps } = props;

    return (
        <div className={css("checklist-view flex-column", className)}>
            {checklistItems.map((checklistItem: IChecklistItem) => (
                <ChecklistItem key={`checklist_${checklistItem.id}`} checklistItem={checklistItem} checklistType={checklistType} {...itemProps} />
            ))}
        </div>
    );
}
