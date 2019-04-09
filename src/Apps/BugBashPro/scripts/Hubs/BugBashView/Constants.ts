import { IHeaderCommandBarItem } from "azure-devops-ui/Components/HeaderCommandBar/HeaderCommandBar.Props";
import { Resources } from "BugBashPro/Resources";

export const BugBashViewPageErrorKey = "BugBashView/PageError";

export const enum BugBashViewPagePivotKeys {
    List = "list",
    Charts = "charts",
    Board = "board"
}

export const enum BugBashItemFieldNames {
    ID = "id",
    Version = "__etag",
    Title = "title",
    Description = "description",
    BugBashId = "bugBashId",
    WorkItemId = "workItemId",
    TeamId = "teamId",
    CreatedDate = "createdDate",
    CreatedBy = "createdBy",
    Rejected = "rejected",
    RejectReason = "rejectReason",
    RejectedBy = "rejectedBy",
    Status = "status"
}

export const enum WorkItemFieldNames {
    Title = "System.Title",
    ID = "System.ID",
    AssignedTo = "System.AssignedTo",
    State = "System.State",
    AreaPath = "System.AreaPath",
    WorkItemType = "System.WorkItemType"
}

export const BugBashItemKeyTypes: { [key: string]: "string" | "identityRef" | "date" | "boolean" | "number" } = {
    [BugBashItemFieldNames.Title]: "string",
    [BugBashItemFieldNames.BugBashId]: "string",
    [BugBashItemFieldNames.CreatedBy]: "identityRef",
    [BugBashItemFieldNames.CreatedDate]: "date",
    [BugBashItemFieldNames.Description]: "string",
    [BugBashItemFieldNames.ID]: "string",
    [BugBashItemFieldNames.Rejected]: "boolean",
    [BugBashItemFieldNames.RejectedBy]: "identityRef",
    [BugBashItemFieldNames.RejectReason]: "string",
    [BugBashItemFieldNames.TeamId]: "string",
    [BugBashItemFieldNames.WorkItemId]: "number",
    [WorkItemFieldNames.AreaPath]: "string",
    [WorkItemFieldNames.AssignedTo]: "identityRef",
    [WorkItemFieldNames.Title]: "string",
    [WorkItemFieldNames.State]: "string",
    [WorkItemFieldNames.WorkItemType]: "string",
    [WorkItemFieldNames.ID]: "number"
};

export const BugBashViewHeaderCommands: { [key: string]: IHeaderCommandBarItem } = {
    new: {
        important: true,
        isPrimary: true,
        id: "newbugbashitem",
        text: Resources.NewBugBashItem,
        iconProps: {
            iconName: "Add"
        }
    },
    edit: {
        important: true,
        id: "editbugbash",
        text: Resources.EditBugBashTitle,
        iconProps: {
            iconName: "Edit"
        }
    },
    details: {
        important: true,
        id: "details",
        text: Resources.Details,
        iconProps: {
            iconName: "Info"
        }
    },
    refresh: {
        important: true,
        id: "refresh",
        text: Resources.Refresh,
        iconProps: {
            iconName: "Refresh"
        }
    }
};
