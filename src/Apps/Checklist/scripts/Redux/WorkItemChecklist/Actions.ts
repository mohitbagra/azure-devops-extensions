import { IChecklistItem, IWorkItemChecklist } from "Checklist/Interfaces";
import { ActionsUnion, createAction } from "Common/Redux";

export const WorkItemChecklistActions = {
    workItemChecklistLoadRequested: (workItemId: number) => createAction(WorkItemChecklistActionTypes.WorkItemChecklistLoadRequested, workItemId),
    beginLoadWorkItemChecklist: (workItemId: number) => createAction(WorkItemChecklistActionTypes.BeginLoadWorkItemChecklist, workItemId),
    workItemChecklistLoaded: (workItemId: number, workItemChecklist: IWorkItemChecklist) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistLoaded, { workItemId, workItemChecklist }),

    workItemChecklistItemCreateRequested: (workItemId: number, checklistItem: IChecklistItem) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemCreateRequested, { workItemId, checklistItem }),
    workItemChecklistItemUpdateRequested: (workItemId: number, checklistItem: IChecklistItem) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemUpdateRequested, { workItemId, checklistItem }),
    workItemChecklistItemDeleteRequested: (workItemId: number, checklistItemId: string) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistItemDeleteRequested, { workItemId, checklistItemId }),

    beginUpdateWorkItemChecklist: (workItemId: number) => createAction(WorkItemChecklistActionTypes.BeginUpdateWorkItemChecklist, workItemId),
    workItemChecklistUpdateFailed: (workItemId: number, error: string) =>
        createAction(WorkItemChecklistActionTypes.WorkItemChecklistUpdateFailed, { workItemId, error })
};

export const enum WorkItemChecklistActionTypes {
    WorkItemChecklistLoadRequested = "WorkItemChecklistAction/WorkItemChecklistLoadRequested",
    BeginLoadWorkItemChecklist = "WorkItemChecklistAction/BeginLoadWorkItemChecklist",
    WorkItemChecklistLoaded = "WorkItemChecklistAction/WorkItemChecklistLoaded",

    WorkItemChecklistItemCreateRequested = "WorkItemChecklistAction/WorkItemChecklistItemCreateRequested",
    WorkItemChecklistItemUpdateRequested = "WorkItemChecklistAction/WorkItemChecklistItemUpdateRequested",
    WorkItemChecklistItemDeleteRequested = "WorkItemChecklistAction/WorkItemChecklistItemDeleteRequested",

    BeginUpdateWorkItemChecklist = "WorkItemChecklistAction/BeginUpdateWorkItemChecklist",
    WorkItemChecklistUpdateFailed = "WorkItemChecklistAction/WorkItemChecklistUpdateFailed"
}

export type WorkItemChecklistActions = ActionsUnion<typeof WorkItemChecklistActions>;
