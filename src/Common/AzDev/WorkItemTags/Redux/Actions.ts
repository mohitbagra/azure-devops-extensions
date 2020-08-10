import { ActionsUnion, createAction } from "Common/Redux";

export const enum TagActionTypes {
    LoadRequested = "Tags/LoadRequested",
    BeginLoad = "Tags/BeginLoad",
    LoadSucceeded = "Tags/LoadSucceeded",
    LoadFailed = "Tags/LoadFailed"
}

export const TagActions = {
    loadRequested: () => createAction(TagActionTypes.LoadRequested),
    beginLoad: () => createAction(TagActionTypes.BeginLoad),
    loadSucceeded: (tags: string[]) => createAction(TagActionTypes.LoadSucceeded, tags),
    loadFailed: (error: string) => createAction(TagActionTypes.LoadFailed, error)
};

export type TagActions = ActionsUnion<typeof TagActions>;
