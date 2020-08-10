export interface IChangeableValue<T> {
    originalValue: T;
    draftValue: T;
}

export const enum LoadStatus {
    NotLoaded = 1,
    Loading,
    LoadFailed,
    Ready,
    Updating,
    UpdateFailed
}
