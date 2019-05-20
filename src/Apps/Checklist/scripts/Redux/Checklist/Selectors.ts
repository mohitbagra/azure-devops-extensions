import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { ChecklistType, IChecklist, IChecklistItem } from "../../Interfaces";
import { IChecklistAwareState, IChecklistState, IChecklistStateModel } from "./Contracts";

export function getChecklistState(state: IChecklistAwareState): IChecklistState | undefined {
    return state.checklistState;
}

export function getChecklistsMap(state: IChecklistAwareState): { [idOrType: string]: IChecklistStateModel } | undefined {
    return state.checklistState && state.checklistState.checklistsMap;
}

export function getChecklistsFilter(state: IChecklistAwareState): IFilterState | undefined {
    return state.checklistState && state.checklistState.filterState;
}

export function getChecklistStateModel(state: IChecklistAwareState, idOrType: number | string): IChecklistStateModel | undefined {
    const checklistState = getChecklistState(state);
    return checklistState && checklistState.checklistsMap && checklistState.checklistsMap[idOrType.toString().toLowerCase()];
}

export const getChecklistStatus = createSelector(
    getChecklistStateModel,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getChecklistError = createSelector(
    getChecklistStateModel,
    state => state && state.error
);

export const getChecklists = createSelector(
    getChecklistStateModel,
    state =>
        state
            ? {
                  personalChecklist: state.personalChecklist,
                  sharedChecklist: state.sharedChecklist,
                  witDefaultChecklist: state.witDefaultChecklist
              }
            : {
                  personalChecklist: undefined,
                  sharedChecklist: undefined,
                  witDefaultChecklist: undefined
              }
);

export const getFilteredChecklists = createSelector(
    [getChecklists, (state: IChecklistAwareState, _: number | string) => getChecklistsFilter(state)],
    (checklists, filter) => {
        const { personalChecklist, sharedChecklist, witDefaultChecklist } = checklists;
        if (!filter) {
            return checklists;
        }

        return {
            personalChecklist: personalChecklist
                ? { ...personalChecklist, checklistItems: personalChecklist.checklistItems.filter(i => matchesFilter(i, filter)) }
                : undefined,
            sharedChecklist: sharedChecklist
                ? { ...sharedChecklist, checklistItems: sharedChecklist.checklistItems.filter(i => matchesFilter(i, filter)) }
                : undefined,
            witDefaultChecklist: witDefaultChecklist
                ? { ...witDefaultChecklist, checklistItems: witDefaultChecklist.checklistItems.filter(i => matchesFilter(i, filter)) }
                : undefined
        };
    }
);

export const getSuggestedLabels = createSelector(
    getChecklistsMap,
    checklistsMap => {
        const labels: string[] = [];
        if (!checklistsMap) {
            return labels;
        }

        for (const idOrType of Object.keys(checklistsMap)) {
            const checklists = checklistsMap[idOrType];
            const { personalChecklist, sharedChecklist, witDefaultChecklist } = checklists;

            if (personalChecklist && personalChecklist.checklistItems) {
                for (const item of personalChecklist.checklistItems) {
                    if (item.labels) {
                        labels.push(...item.labels);
                    }
                }
            }
            if (sharedChecklist && sharedChecklist.checklistItems) {
                for (const item of sharedChecklist.checklistItems) {
                    if (item.labels) {
                        labels.push(...item.labels);
                    }
                }
            }
            if (witDefaultChecklist && witDefaultChecklist.checklistItems) {
                for (const item of witDefaultChecklist.checklistItems) {
                    if (item.labels) {
                        labels.push(...item.labels);
                    }
                }
            }
        }

        return Array.from(new Set(labels));
    }
);

export function getChecklist(state: IChecklistAwareState, idOrType: number | string, checklistType: ChecklistType): IChecklist | undefined {
    const checklistStateModel = getChecklistStateModel(state, idOrType);
    if (checklistStateModel) {
        switch (checklistType) {
            case ChecklistType.Personal: {
                return checklistStateModel.personalChecklist;
            }
            case ChecklistType.Shared: {
                return checklistStateModel.sharedChecklist;
            }
            case ChecklistType.WitDefault: {
                return checklistStateModel.witDefaultChecklist;
            }
        }
    }
    return undefined;
}

function matchesFilter(checklistItem: IChecklistItem, filter: IFilterState): boolean {
    const labels: string[] | undefined = filter.labels && filter.labels.value;

    // if filter has no labels, then match
    if (!labels || labels.length === 0) {
        return true;
    }

    // if filter has labels, but item has no labels, then no match
    if (!checklistItem.labels || checklistItem.labels.length === 0) {
        return false;
    }

    return checklistItem.labels.some(l => labels.indexOf(l) !== -1);
}
