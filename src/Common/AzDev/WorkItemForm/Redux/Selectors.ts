import { IWorkItemFormAwareState, IWorkItemFormState } from "./Contracts";

export function getWorkItemFormState(state: IWorkItemFormAwareState): IWorkItemFormState | undefined {
    return state.workItemFormState;
}

export function hasActiveWorkItem(state: IWorkItemFormAwareState): boolean {
    return !!(state.workItemFormState && state.workItemFormState.hasActiveWorkItem);
}

export function getActiveWorkItemId(state: IWorkItemFormAwareState): number | undefined {
    return state.workItemFormState && state.workItemFormState.activeWorkItemId;
}

export function isActiveWorkItemNew(state: IWorkItemFormAwareState): boolean {
    return !!(state.workItemFormState && state.workItemFormState.isNew);
}

export function isActiveWorkItemReadOnly(state: IWorkItemFormAwareState): boolean {
    return !!(state.workItemFormState && state.workItemFormState.isReadOnly);
}
