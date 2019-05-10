import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { ChecklistType, IChecklist } from "../../Interfaces";
import { IChecklistAwareState, IChecklistState, IChecklistStateModel } from "./Contracts";

export function getChecklistState(state: IChecklistAwareState): IChecklistState | undefined {
    return state.checklistState;
}

export function getChecklistsMap(state: IChecklistAwareState): { [idOrType: string]: IChecklistStateModel } | undefined {
    return state.checklistState && state.checklistState.checklistsMap;
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
