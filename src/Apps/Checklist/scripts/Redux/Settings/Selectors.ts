import { createSelector } from "reselect";

import { IChecklistSettingsAwareState, IChecklistSettingsState } from "./Contracts";

export function getChecklistSettingsState(state: IChecklistSettingsAwareState): IChecklistSettingsState | undefined {
    return state.checklistSettingsState;
}

export const areSettignsInitialized = createSelector(getChecklistSettingsState, (state) => !!(state && state.initialized));

export const isWordWrapOn = createSelector(getChecklistSettingsState, (state) => !!(state && state.wordWrap));

export const isHideCompletedItemsOn = createSelector(getChecklistSettingsState, (state) => !!(state && state.hideCompletedItems));

export const isShowLabelsOn = createSelector(getChecklistSettingsState, (state) => !!(state && state.showLabels));
