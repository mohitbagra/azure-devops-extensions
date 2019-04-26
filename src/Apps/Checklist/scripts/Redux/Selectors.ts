import { IChecklistItem } from "Checklist/Interfaces";
import { LoadStatus } from "Common/Contracts";
import { resolveNullableMapKey } from "Common/Utilities/String";
import { createSelector } from "reselect";
import { IWorkItemChecklistAwareState, IWorkItemChecklistState, IWorkItemChecklistStateModel } from "./Contracts";

export function getWorkItemChecklistState(state: IWorkItemChecklistAwareState): IWorkItemChecklistState | undefined {
    return state.workItemChecklistState;
}

export function getWorkItemChecklistStateModel(state: IWorkItemChecklistAwareState, workItemId: number): IWorkItemChecklistStateModel | undefined {
    const checklistState = getWorkItemChecklistState(state);
    return checklistState && checklistState.workItemChecklistsMap && checklistState.workItemChecklistsMap[workItemId];
}

export const getWorkItemChecklistStatus = createSelector(
    getWorkItemChecklistStateModel,
    state => (state && state.status) || LoadStatus.NotLoaded
);

export const getWorkItemChecklistError = createSelector(
    getWorkItemChecklistStateModel,
    state => state && state.error
);

export const getWorkItemChecklist = createSelector(
    getWorkItemChecklistStateModel,
    state => state && state.checklist
);

export function getWorkItemChecklistItem(
    state: IWorkItemChecklistAwareState,
    workItemId: number,
    checklistItemId: string
): IChecklistItem | undefined {
    const checklistStateModel = getWorkItemChecklistStateModel(state, workItemId);
    return (
        checklistStateModel && checklistStateModel.checklistItemsMap && checklistStateModel.checklistItemsMap[resolveNullableMapKey(checklistItemId)]
    );
}
