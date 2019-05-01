import { createContext } from "react";
import { ChecklistItemState, IChecklistItemState } from "./Interfaces";

// context value will be wither work item id (as string) or work item type
export const ChecklistContext = createContext<number | string>("");

export const ChecklistItemStates: { [checklistItemState: string]: IChecklistItemState } = {
    [ChecklistItemState.New]: {
        name: ChecklistItemState.New,
        className: "checklist-item-state-new"
    },
    [ChecklistItemState.InProgress]: {
        name: ChecklistItemState.InProgress,
        className: "checklist-item-state-inprogress"
    },
    [ChecklistItemState.Blocked]: {
        name: ChecklistItemState.Blocked,
        className: "checklist-item-state-blocked"
    },
    [ChecklistItemState.NA]: {
        name: ChecklistItemState.NA,
        className: "checklist-item-state-na"
    },
    [ChecklistItemState.Completed]: {
        name: ChecklistItemState.Completed,
        className: "checklist-item-state-completed"
    }
};
