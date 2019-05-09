import { createContext } from "react";
import { ChecklistItemState, IChecklistItemState } from "./Interfaces";

// context value will be wither work item id (as string) or work item type
export const ChecklistContext = createContext<number | string>("");

export const ChecklistItemStates: { [checklistItemState: string]: IChecklistItemState } = {
    [ChecklistItemState.New]: {
        name: ChecklistItemState.New,
        className: "checklist-item-state-new",
        color: {
            red: 255,
            green: 185,
            blue: 0
        }
    },
    [ChecklistItemState.InProgress]: {
        name: ChecklistItemState.InProgress,
        className: "checklist-item-state-inprogress",
        color: {
            red: 0,
            green: 122,
            blue: 204
        }
    },
    [ChecklistItemState.Blocked]: {
        name: ChecklistItemState.Blocked,
        className: "checklist-item-state-blocked",
        color: {
            red: 184,
            green: 14,
            blue: 28
        }
    },
    [ChecklistItemState.NA]: {
        name: ChecklistItemState.NA,
        className: "checklist-item-state-na",
        color: {
            red: 234,
            green: 234,
            blue: 234
        }
    },
    [ChecklistItemState.Completed]: {
        name: ChecklistItemState.Completed,
        className: "checklist-item-state-completed",
        color: {
            red: 146,
            green: 195,
            blue: 83
        }
    }
};
