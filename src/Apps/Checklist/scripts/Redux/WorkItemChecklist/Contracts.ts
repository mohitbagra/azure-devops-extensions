import { IChecklistItem, IWorkItemChecklist } from "Checklist/Interfaces";
import { LoadStatus } from "Common/Contracts";

export interface IWorkItemChecklistAwareState {
    workItemChecklistState: IWorkItemChecklistState;
}

export interface IWorkItemChecklistState {
    workItemChecklistsMap: { [workItemId: number]: IWorkItemChecklistStateModel };
}

export interface IWorkItemChecklistStateModel {
    status: LoadStatus;
    checklist?: IWorkItemChecklist;
    checklistItemsMap?: { [id: string]: IChecklistItem };
}
