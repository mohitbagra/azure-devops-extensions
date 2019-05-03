import { ActionsUnion, createAction } from "Common/Redux";

export const ChecklistSettingsActions = {
    initialize: () => createAction(ChecklistSettingsActionTypes.Initialize),
    toggleWordWrap: () => createAction(ChecklistSettingsActionTypes.ToggleWordWrap),
    toggleHideCompletedItems: () => createAction(ChecklistSettingsActionTypes.ToggleHideCompletedItems)
};

export const enum ChecklistSettingsActionTypes {
    Initialize = "ChecklistSettings/Initialize",
    ToggleWordWrap = "ChecklistSettings/ToggleWordWrap",
    ToggleHideCompletedItems = "ChecklistSettings/ToggleHideCompletedItems"
}

export type ChecklistSettingsActions = ActionsUnion<typeof ChecklistSettingsActions>;
