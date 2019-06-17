import { LoadStatus } from "Common/Contracts";
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

export const getFilterState = createSelector(
    getRelatedWitsState,
    state => state.filterState
);

export const getSortState = createSelector(
    getRelatedWitsState,
    state => state.sortState
);

export const getSortColumn = createSelector(
    getSortState,
    state => state && state.sortKey
);

export const isSortedDescending = createSelector(
    getSortState,
    state => !!(state && state.isSortedDescending)
);

export const getRelatedWorkItemsStateModel = (state: IRelatedWitsAwareState, workItemId: number) => {
    return (
        state &&
        state.relatedWorkItemsState &&
        state.relatedWorkItemsState.relatedWorkItems &&
        state.relatedWorkItemsState.relatedWorkItems[workItemId]
    );
};

export const getRelatedWits = createSelector(
    getRelatedWorkItemsStateModel,
    state => state && state.workItems
);

export const getRelatedWitsStatus = createSelector(
    getRelatedWorkItemsStateModel,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getRelatedWitsError = createSelector(
    getRelatedWorkItemsStateModel,
    state => state && state.error
);

export const getSettingsStatus = createSelector(
    getSettingsState,
    state => state.status || LoadStatus.NotLoaded
);

export const getSettings = createSelector(
    getSettingsState,
    state => state.settings
);

export const isPanelOpen = createSelector(
    getSettingsState,
    state => !!state.isPanelOpen
);

export const hasActiveWorkItem = createSelector(
    getActiveWorkItemState,
    state => state.id != null && state.id > 0
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
