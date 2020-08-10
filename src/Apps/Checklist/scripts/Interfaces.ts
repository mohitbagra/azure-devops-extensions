import { IdentityRef } from "azure-devops-extension-api/WebApi/WebApi";
import { IColor } from "azure-devops-ui/Utilities/Color";

export interface IChecklist {
    id: string;
    __etag?: number;
    checklistItems: IChecklistItem[];
}

export interface IChecklistItem {
    id: string;
    text: string;
    required?: boolean;
    state: ChecklistItemState;
    completedBy?: IdentityRef;
    completedDate?: Date;
    labels?: string[];
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
    color: IColor;
    className: string;
}

export interface IGroupedChecklists {
    personalChecklist: IChecklist | undefined;
    sharedChecklist: IChecklist | undefined;
    witDefaultChecklist: IChecklist | undefined;
}

export const enum ChecklistType {
    Personal = "personal",
    Shared = "shared",
    WitDefault = "witDefault"
}
