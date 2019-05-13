import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { ActionsUnion, createAction } from "Common/Redux";
import { ChecklistType, IChecklist, IChecklistItem, IGroupedChecklists } from "../../Interfaces";

export const ChecklistActions = {
    checklistLoadRequested: (idOrType: number | string) => createAction(ChecklistActionTypes.ChecklistLoadRequested, idOrType),
    beginLoadChecklist: (idOrType: number | string) => createAction(ChecklistActionTypes.BeginLoadChecklist, idOrType),
    checklistLoaded: (idOrType: number | string, groupedChecklists: IGroupedChecklists) =>
        createAction(ChecklistActionTypes.ChecklistLoaded, { idOrType, groupedChecklists }),

    checklistItemCreateRequested: (idOrType: number | string, checklistItem: IChecklistItem, checklistType: ChecklistType) =>
        createAction(ChecklistActionTypes.ChecklistItemCreateRequested, { idOrType, checklistItem, checklistType }),
    checklistItemUpdateRequested: (idOrType: number | string, checklistItem: IChecklistItem, checklistType: ChecklistType) =>
        createAction(ChecklistActionTypes.ChecklistItemUpdateRequested, { idOrType, checklistItem, checklistType }),
    checklistItemDeleteRequested: (idOrType: number | string, checklistItemId: string, checklistType: ChecklistType) =>
        createAction(ChecklistActionTypes.ChecklistItemDeleteRequested, { idOrType, checklistItemId, checklistType }),
    checklistItemReorderRequested: (idOrType: number | string, checklistItemId: string, checklistType: ChecklistType, newIndex: number) =>
        createAction(ChecklistActionTypes.ChecklistItemReorderRequested, { idOrType, checklistItemId, checklistType, newIndex }),

    beginUpdateChecklist: (idOrType: number | string, unsavedChecklist: IChecklist, checklistType: ChecklistType) =>
        createAction(ChecklistActionTypes.BeginUpdateChecklist, { idOrType, unsavedChecklist, checklistType }),
    checklistUpdated: (idOrType: number | string, checklist: IChecklist, checklistType: ChecklistType) =>
        createAction(ChecklistActionTypes.ChecklistUpdated, { idOrType, checklist, checklistType }),
    checklistUpdateFailed: (idOrType: number | string, error: string) =>
        createAction(ChecklistActionTypes.ChecklistUpdateFailed, { idOrType, error }),

    applyFilter: (filterState: IFilterState) => createAction(ChecklistActionTypes.ApplyFilter, filterState)
};

export const enum ChecklistActionTypes {
    ChecklistLoadRequested = "ChecklistAction/ChecklistLoadRequested",
    BeginLoadChecklist = "ChecklistAction/BeginLoadChecklist",
    ChecklistLoaded = "ChecklistAction/ChecklistLoaded",

    ChecklistItemCreateRequested = "ChecklistAction/ChecklistItemCreateRequested",
    ChecklistItemUpdateRequested = "ChecklistAction/ChecklistItemUpdateRequested",
    ChecklistItemDeleteRequested = "ChecklistAction/ChecklistItemDeleteRequested",
    ChecklistItemReorderRequested = "ChecklistAction/ChecklistItemReorderRequested",

    BeginUpdateChecklist = "ChecklistAction/BeginUpdateChecklist",
    ChecklistUpdated = "ChecklistAction/ChecklistUpdated",
    ChecklistUpdateFailed = "ChecklistAction/ChecklistUpdateFailed",

    ApplyFilter = "ChecklistAction/ApplyFilter"
}

export type ChecklistActions = ActionsUnion<typeof ChecklistActions>;
