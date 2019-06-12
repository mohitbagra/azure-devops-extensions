import { createSelector } from "reselect";
import { IActiveWorkItemState, IRelatedWitsAwareState, IRelatedWorkItemsState, ISettingsState } from "./Contracts";

export function getRelatedWitsState(state: IRelatedWitsAwareState): IRelatedWorkItemsState {
    return state.relatedWorkItemsState;
}

export function getSettingsState(state: IRelatedWitsAwareState): ISettingsState {
    return state.settingsState;
}

export function getActiveWorkItemState(state: IRelatedWitsAwareState): IActiveWorkItemState {
    return state.activeWorkItemState;
}

export const getRelatedWits = createSelector(
    getRelatedWitsState,
    state => state.filteredItems
);
export const getFilterState = createSelector(
    getRelatedWitsState,
    state => state.filterState
);
export const getSortColumn = createSelector(
    getRelatedWitsState,
    state => state.sortState && state.sortState.sortKey
);
export const isSortedDescending = createSelector(
    getRelatedWitsState,
    state => state.sortState && state.sortState.isSortedDescending
);
export const areRelatedWitsLoading = createSelector(
    getRelatedWitsState,
    state => state.loading
);
export const getRelatedWitsError = createSelector(
    getRelatedWitsState,
    state => state.error
);
export const getRelatedWitsPropertyMap = createSelector(
    getRelatedWitsState,
    state => state.propertyMap
);

export const areSettingsLoading = createSelector(
    getSettingsState,
    state => state.loading
);
export const getSettings = createSelector(
    getSettingsState,
    state => state.settings
);
export const isPanelOpen = createSelector(
    getSettingsState,
    state => state.isPanelOpen
);

export const hasActiveWorkItem = createSelector(
    getActiveWorkItemState,
    state => state.loaded
);
export const isActiveWorkItemNew = createSelector(
    getActiveWorkItemState,
    state => state.isNew
);
export const getQueryableFields = createSelector(
    getActiveWorkItemState,
    state => state.queryableFields
);
export const getSortableFields = createSelector(
    getActiveWorkItemState,
    state => state.sortableFields
);
export const getActiveWorkItemRevision = createSelector(
    getActiveWorkItemState,
    state => state.rev
);
export const getActiveWorkItemLinks = createSelector(
    getActiveWorkItemState,
    state => state.links
);
export const getActiveWorkItemRelationTypes = createSelector(
    getActiveWorkItemState,
    state => state.relationTypes
);
export const getActiveWorkItemProject = createSelector(
    getActiveWorkItemState,
    state => state.project
);
export const getActiveWorkItemWorkItemTypeName = createSelector(
    getActiveWorkItemState,
    state => state.workItemTypeName
);
export const getActiveWorkItemId = createSelector(
    getActiveWorkItemState,
    state => state.id
);
