export interface IWorkItemChecklist {
    id: string;
    __etag?: number;
    checklistItems: IChecklistItem[];
}

export interface IChecklistItem {
    id: string;
    text: string;
    required?: boolean;
    state?: ChecklistItemState;
    isDefault?: boolean;
}

export const enum ChecklistItemState {
    New = "New",
    InProgress = "In Progress",
    Blocked = "Blocked",
    NA = "N/A",
    Completed = "Completed"
}

export interface IChecklistItemState {
    name: ChecklistItemState;
    backgroundColor: string;
    foregroundColor: string;
}

export interface IWorkItemChecklists {
    personal: IWorkItemChecklist;
    shared: IWorkItemChecklist;
    witDefault: IWorkItemChecklist;
}

export const enum ChecklistType {
    Personal = 0,
    Shared,
    WitDefault
}