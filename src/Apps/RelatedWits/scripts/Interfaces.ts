export interface ISettings {
    fields: string[];
    sortByField: string;
    top?: number;
}

export const enum WorkItemFieldNames {
    Title = "System.Title",
    ID = "System.ID",
    AssignedTo = "System.AssignedTo",
    State = "System.State",
    AreaPath = "System.AreaPath",
    WorkItemType = "System.WorkItemType"
}

export interface ISortState {
    sortKey: WorkItemFieldNames;
    isSortedDescending: boolean;
}
