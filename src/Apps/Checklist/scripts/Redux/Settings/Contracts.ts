export interface IChecklistSettingsAwareState {
    checklistSettingsState: IChecklistSettingsState;
}

export interface IChecklistSettingsState {
    initialized: boolean;
    wordWrap: boolean;
    hideCompletedItems: boolean;
}
