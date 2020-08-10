import { IHeaderCommandBarItem } from "azure-devops-ui/Components/HeaderCommandBar/HeaderCommandBar.Props";
import { Resources } from "BugBashPro/Resources";

export const BugBashKeyTypes: { [key: string]: "string" | "date" | "boolean" } = {
    [BugBashFieldNames.Title]: "string",
    [BugBashFieldNames.StartTime]: "date",
    [BugBashFieldNames.EndTime]: "date",
    [BugBashFieldNames.AcceptTemplateId]: "string",
    [BugBashFieldNames.AcceptTemplateTeam]: "string",
    [BugBashFieldNames.AutoAccept]: "boolean",
    [BugBashFieldNames.ID]: "string",
    [BugBashFieldNames.DefaultTeam]: "string",
    [BugBashFieldNames.ItemDescriptionField]: "string",
    [BugBashFieldNames.ProjectId]: "string",
    [BugBashFieldNames.WorkItemType]: "string"
};

export const enum BugBashFieldNames {
    ID = "id",
    Version = "__etag",
    Title = "title",
    WorkItemType = "workItemType",
    ProjectId = "projectId",
    ItemDescriptionField = "itemDescriptionField",
    AutoAccept = "autoAccept",
    StartTime = "startTime",
    EndTime = "endTime",
    DefaultTeam = "defaultTeam",
    AcceptTemplateTeam = "acceptTemplateTeam",
    AcceptTemplateId = "acceptTemplateId"
}

export const DirectoryPageErrorKey = "BugBashDirectory/PageError";

export const DirectoryPageHeaderCommands: { [key: string]: IHeaderCommandBarItem } = {
    new: {
        important: true,
        isPrimary: true,
        id: "newbugbash",
        text: Resources.NewBugBash,
        iconProps: {
            iconName: "Add"
        }
    },
    refresh: {
        important: true,
        id: "refresh",
        text: Resources.Refresh,
        iconProps: {
            iconName: "Refresh"
        }
    },
    settings: {
        important: true,
        id: "settings",
        text: Resources.Settings,
        iconProps: {
            iconName: "Settings"
        }
    }
};
