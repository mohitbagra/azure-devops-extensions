import { ActionsUnion, createAction } from "Common/Redux";

export const ChecklistSettingsActions = {
    initialize: () => createAction(ChecklistSettingsActionTypes.Initialize),
    toggleWordWrap: () => createAction(ChecklistSettingsActionTypes.ToggleWordWrap),
    toggleHideCompletedItems: () => createAction(ChecklistSettingsActionTypes.ToggleHideCompletedItems),
    toggleShowLabels: () => createAction(ChecklistSettingsActionTypes.ToggleShowLabels)
};

export const enum ChecklistSettingsActionTypes {
    Initialize = "ChecklistSettings/Initialize",
    ToggleWordWrap = "ChecklistSettings/ToggleWordWrap",
    ToggleHideCompletedItems = "ChecklistSettings/ToggleHideCompletedItems",
    ToggleShowLabels = "ChecklistSettings/ToggleShowLabels"
}

export type ChecklistSettingsActions = ActionsUnion<typeof ChecklistSettingsActions>;
