import { FieldType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";

export const StorageKey = "rwf";
export const UserScope = { scopeType: "User" };

export const DEFAULT_SORT_BY_FIELD = "System.ChangedDate";
export const DEFAULT_RESULT_SIZE = 20;

export const DEFAULT_FIELDS_TO_RETRIEVE = [
    "System.ID",
    "System.WorkItemType",
    "System.Title",
    "System.AssignedTo",
    "System.AreaPath",
    "System.State"
];

export const DEFAULT_FIELDS_TO_SEEK = ["System.WorkItemType", "System.Tags", "System.State", "System.AreaPath"];

export const DEFAULT_SETTINGS = {
    fields: DEFAULT_FIELDS_TO_SEEK,
    sortByField: DEFAULT_SORT_BY_FIELD,
    top: DEFAULT_RESULT_SIZE
};

export const QueryableFieldTypes = [FieldType.Boolean, FieldType.Double, FieldType.Integer, FieldType.String, FieldType.TreePath];

export const SortableFieldTypes = [FieldType.DateTime, FieldType.Double, FieldType.Integer, FieldType.String, FieldType.TreePath];

export const ExcludedFields = [
    "System.AttachedFiles",
    "System.AttachedFileCount",
    "System.ExternalLinkCount",
    "System.HyperLinkCount",
    "System.BISLinks",
    "System.LinkedFiles",
    "System.PersonId",
    "System.RelatedLinks",
    "System.RelatedLinkCount",
    "System.TeamProject",
    "System.Rev",
    "System.Watermark",
    "Microsoft.VSTS.Build.IntegrationBuild"
];
