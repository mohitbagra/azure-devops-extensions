import { CoreFieldRefNames } from "Common/Constants";
import { LoadStatus } from "Common/Contracts";
import { getDistinctNameFromIdentityRef } from "Common/Utilities/Identity";
import { createSelector } from "reselect";
import { applyFilterAndSort } from "../Helpers";
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

export const getRelatedWitsFilterData = createSelector(
    getRelatedWits,
    workItems => {
        const propertyMap: { [key: string]: { [subkey: string]: number } } = {
            [CoreFieldRefNames.AreaPath]: {},
            [CoreFieldRefNames.WorkItemType]: {},
            [CoreFieldRefNames.AssignedTo]: {},
            [CoreFieldRefNames.State]: {}
        };

        if (!workItems) {
            return propertyMap;
        }

        for (const workItem of workItems) {
            const areaPath = workItem.fields[CoreFieldRefNames.AreaPath];
            const workItemType = workItem.fields[CoreFieldRefNames.WorkItemType];
            const assignedTo = getDistinctNameFromIdentityRef(workItem.fields[CoreFieldRefNames.AssignedTo]) || "Unassigned";
            const state = workItem.fields[CoreFieldRefNames.State];

            propertyMap[CoreFieldRefNames.WorkItemType][workItemType] = (propertyMap[CoreFieldRefNames.WorkItemType][workItemType] || 0) + 1;
            propertyMap[CoreFieldRefNames.AreaPath][areaPath] = (propertyMap[CoreFieldRefNames.AreaPath][areaPath] || 0) + 1;
            propertyMap[CoreFieldRefNames.State][state] = (propertyMap[CoreFieldRefNames.State][state] || 0) + 1;
            propertyMap[CoreFieldRefNames.AssignedTo][assignedTo] = (propertyMap[CoreFieldRefNames.AssignedTo][assignedTo] || 0) + 1;
        }

        return propertyMap;
    }
);

export const getFilteredRelatedWits = createSelector(
    [
        getRelatedWits,
        (state: IRelatedWitsAwareState, _: number) => getFilterState(state),
        (state: IRelatedWitsAwareState, _: number) => getSortColumn(state),
        (state: IRelatedWitsAwareState, _: number) => isSortedDescending(state)
    ],
    (workItems, filterState, sortKey, isSortedDescending) => {
        return applyFilterAndSort(workItems, filterState, sortKey ? { sortKey, isSortedDescending } : undefined);
    }
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

export const getQueryableFields = createSelector(
    getActiveWorkItemState,
    state => state.queryableFields
);

export const getSortableFields = createSelector(
    getActiveWorkItemState,
    state => state.sortableFields
);

export const getActiveWorkItemRelationsMap = createSelector(
    getActiveWorkItemState,
    state =>
        state.links
            ? state.links.reduce<{ [key: string]: boolean }>((obj, relation) => {
                  obj[`${relation.url}_${relation.rel}`] = true;
                  return obj;
              }, {})
            : {}
);

export const getActiveWorkItemRelationTypes = createSelector(
    getActiveWorkItemState,
    state => state.relationTypes || []
);
