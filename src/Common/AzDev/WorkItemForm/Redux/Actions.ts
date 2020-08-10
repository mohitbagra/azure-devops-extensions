import {
    IWorkItemChangedArgs,
    IWorkItemFieldChangedArgs,
    IWorkItemLoadedArgs
} from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { ActionsUnion, createAction } from "Common/Redux";

export const enum WorkItemFormActionTypes {
    WorkItemLoaded = "WorkItemFormAction/WorkItemLoaded",
    WorkItemUnloaded = "WorkItemFormAction/WorkItemUnloaded",
    WorkItemSaved = "WorkItemFormAction/WorkItemSaved",
    WorkItemReset = "WorkItemFormAction/WorkItemReset",
    WorkItemRefreshed = "WorkItemFormAction/WorkItemRefreshed",
    WorkItemFieldChanged = "WorkItemFormAction/WorkItemFieldChanged",
    Resize = "WorkItemFormAction/Resize"
}

export const WorkItemFormActions = {
    workItemLoaded: (workItemLoadedArgs: IWorkItemLoadedArgs) => createAction(WorkItemFormActionTypes.WorkItemLoaded, workItemLoadedArgs),
    workItemUnloaded: (unloadedEventArgs: IWorkItemChangedArgs) => createAction(WorkItemFormActionTypes.WorkItemUnloaded, unloadedEventArgs),
    workItemSaved: (savedEventArgs: IWorkItemChangedArgs) => createAction(WorkItemFormActionTypes.WorkItemSaved, savedEventArgs),
    workItemReset: (undoEventArgs: IWorkItemChangedArgs) => createAction(WorkItemFormActionTypes.WorkItemReset, undoEventArgs),
    workItemRefreshed: (refreshEventArgs: IWorkItemChangedArgs) => createAction(WorkItemFormActionTypes.WorkItemRefreshed, refreshEventArgs),
    workItemFieldChanged: (fieldChangedArgs: IWorkItemFieldChangedArgs) =>
        createAction(WorkItemFormActionTypes.WorkItemFieldChanged, fieldChangedArgs),
    resize: (height: number) => createAction(WorkItemFormActionTypes.Resize, { height })
};

export type WorkItemFormActions = ActionsUnion<typeof WorkItemFormActions>;
