import { ActionsUnion, createAction } from "Common/Redux/Helpers";

export const TagActions = {
    loadRequested: () => createAction(TagActionTypes.LoadRequested),
    beginLoad: () => createAction(TagActionTypes.BeginLoad),
    loadSucceeded: (tags: string[]) => createAction(TagActionTypes.LoadSucceeded, tags),
    loadFailed: (error: string) => createAction(TagActionTypes.LoadFailed, error)
};

export const enum TagActionTypes {
    LoadRequested = "Tags/LoadRequested",
    BeginLoad = "Tags/BeginLoad",
    LoadSucceeded = "Tags/LoadSucceeded",
    LoadFailed = "Tags/LoadFailed"
}

export type TagActions = ActionsUnion<typeof TagActions>;
