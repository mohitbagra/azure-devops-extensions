import { LoadStatus } from "Common/Contracts";
import { createSelector } from "reselect";
import { ChecklistType, IChecklist } from "../Interfaces";
import { IChecklistAwareState, IChecklistState, IChecklistStateModel } from "./Contracts";

export function getChecklistState(state: IChecklistAwareState): IChecklistState | undefined {
    return state.checklistState;
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
