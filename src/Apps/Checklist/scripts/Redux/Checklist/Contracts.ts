import { LoadStatus } from "Common/Contracts";
import { IGroupedChecklists } from "../../Interfaces";

export interface IChecklistAwareState {
    checklistState: IChecklistState;
}

export interface IChecklistState {
    checklistsMap: { [idOrType: string]: IChecklistStateModel };
}

export interface IChecklistStateModel extends IGroupedChecklists {
    status: LoadStatus;
    error?: string;
}
