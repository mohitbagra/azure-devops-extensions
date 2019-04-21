import { IChecklistItem, IWorkItemChecklist } from "Checklist/Interfaces";
import { ActionsUnion, createAction } from "Common/Redux";

export const WorkItemChecklistActions = {
    workItemChecklistLoadRequested: (workItemId: number) => createAction(WorkItemChecklistActionTypes.WorkItemChecklistLoadRequested, workItemId),
    beginLoadWorkItemChecklist: (workItemId: number) => createAction(WorkItemChecklistActionTypes.BeginLoadWorkItemChecklist, workItemId),
    workItemChecklistLoaded: (workItemId: number, workItemChecklist: IWorkItemChecklist) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistLoaded, { workItemId, workItemChecklist }),

    workItemChecklistItemCreateRequested: (workItemId: number, checklistItem: IChecklistItem) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemCreateRequested, { workItemId, checklistItem }),
    beginCreateWorkItemChecklistItem: (workItemId: number, checklistItem: IChecklistItem) =>
        createAction(WorkItemChecklistActionTypes.BeginCreateWorkItemChecklistItem, { workItemId, checklistItem }),
    workItemChecklistItemCreated: (workItemId: number, checklistItem: IChecklistItem) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemCreated, { workItemId, checklistItem }),
    workItemChecklistItemCreateFailed: (workItemId: number, checklistItem: IChecklistItem, error: string) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemCreateFailed, { workItemId, checklistItem, error }),

    workItemChecklistItemUpdateRequested: (workItemId: number, checklistItem: IChecklistItem) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemUpdateRequested, { workItemId, checklistItem }),
    beginUpdateWorkItemChecklistItem: (workItemId: number, checklistItem: IChecklistItem) =>
        createAction(WorkItemChecklistActionTypes.BeginUpdateWorkItemChecklistItem, { workItemId, checklistItem }),
    workItemChecklistItemUpdated: (workItemId: number, checklistItem: IChecklistItem) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemUpdated, { workItemId, checklistItem }),
    workItemChecklistItemUpdateFailed: (workItemId: number, checklistItem: IChecklistItem, error: string) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemUpdateFailed, { workItemId, checklistItem, error }),

    workItemChecklistItemDeleteRequested: (workItemId: number, checklistItemId: string) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemDeleteRequested, { workItemId, checklistItemId }),
    beginDeleteWorkItemChecklistItem: (workItemId: number, checklistItemId: string) =>
        createAction(WorkItemChecklistActionTypes.BeginDeleteWorkItemChecklistItem, { workItemId, checklistItemId }),
    workItemChecklistItemDeleted: (workItemId: number, checklistItemId: string) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemDeleted, { workItemId, checklistItemId }),
    workItemChecklistItemDeleteFailed: (workItemId: number, checklistItemId: string, error: string) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemDeleteFailed, { workItemId, checklistItemId, error })
};

export const enum WorkItemChecklistActionTypes {
    WorkItemChecklistLoadRequested = "WorkItemChecklistAction/WorkItemChecklistLoadRequested",
    BeginLoadWorkItemChecklist = "WorkItemChecklistAction/BeginLoadWorkItemChecklist",
    WorkItemChecklistLoaded = "WorkItemChecklistAction/WorkItemChecklistLoaded",

    WorkItemChecklistItemCreateRequested = "WorkItemChecklistAction/WorkItemChecklistItemCreateRequested",
    BeginCreateWorkItemChecklistItem = "WorkItemChecklistAction/BeginCreateWorkItemChecklistItem",
    WorkItemChecklistItemCreated = "WorkItemChecklistAction/WorkItemChecklistItemCreated",
    WorkItemChecklistItemCreateFailed = "WorkItemChecklistAction/WorkItemChecklistItemCreateFailed",

    WorkItemChecklistItemUpdateRequested = "WorkItemChecklistAction/WorkItemChecklistItemUpdateRequested",
    BeginUpdateWorkItemChecklistItem = "WorkItemChecklistAction/BeginUpdateWorkItemChecklistItem",
    WorkItemChecklistItemUpdated = "WorkItemChecklistAction/WorkItemChecklistItemUpdated",
    WorkItemChecklistItemUpdateFailed = "WorkItemChecklistAction/WorkItemChecklistItemUpdateFailed",

    WorkItemChecklistItemDeleteRequested = "WorkItemChecklistAction/WorkItemChecklistItemDeleteRequested",
    BeginDeleteWorkItemChecklistItem = "WorkItemChecklistAction/BeginDeleteWorkItemChecklistItem",
    WorkItemChecklistItemDeleted = "WorkItemChecklistAction/WorkItemChecklistItemDeleted",
    WorkItemChecklistItemDeleteFailed = "WorkItemChecklistAction/WorkItemChecklistItemDeleteFailed"
}

export type WorkItemChecklistActions = ActionsUnion<typeof WorkItemChecklistActions>;
