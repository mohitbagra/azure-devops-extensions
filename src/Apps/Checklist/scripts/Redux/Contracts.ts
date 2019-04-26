import { IChecklistItem, IWorkItemChecklist } from "Checklist/Interfaces";
import { LoadStatus } from "Common/Contracts";

export interface IWorkItemChecklistAwareState {
    workItemChecklistState: IWorkItemChecklistState;
}

export interface IWorkItemChecklistState {
    workItemChecklistsMap: { [workItemId: number]: IWorkItemChecklistStateModel };
}

export interface IWorkItemTypeChecklistState {
    workItemTypeChecklistsMap: { [workItemType: string]: IWorkItemChecklistStateModel };
}

export interface IWorkItemChecklistStateModel {
    status: LoadStatus;
    error?: string;
    checklist?: IWorkItemChecklist;
    checklistItemsMap?: { [id: string]: IChecklistItem };
}
