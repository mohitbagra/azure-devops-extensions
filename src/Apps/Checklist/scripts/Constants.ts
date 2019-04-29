import { createContext } from "react";
import { ChecklistItemState, IChecklistItemState } from "./Interfaces";

// context value will be wither work item id (as string) or work item type
export const ChecklistContext = createContext<number | string>("");

export const ChecklistItemStates: { [checklistItemState: string]: IChecklistItemState } = {
    [ChecklistItemState.New]: {
        name: ChecklistItemState.New,
        backgroundColor: "#ffb900",
        foregroundColor: "#222222"
    },
    [ChecklistItemState.InProgress]: {
        name: ChecklistItemState.InProgress,
        backgroundColor: "#cbe3f3",
        foregroundColor: "#007acc"
    },
    [ChecklistItemState.Blocked]: {
        name: ChecklistItemState.Blocked,
        backgroundColor: "#ebb4b4",
        foregroundColor: "#a80000"
    },
    [ChecklistItemState.NA]: {
        name: ChecklistItemState.NA,
        backgroundColor: "#eaeaea",
        foregroundColor: "#3c3c3c"
    },
    [ChecklistItemState.Completed]: {
        name: ChecklistItemState.Completed,
        backgroundColor: "#c0e5c0",
        foregroundColor: "#159715"
    }
};
