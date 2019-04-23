export interface IWorkItemFormAwareState {
    workItemFormState: IWorkItemFormState;
}

export interface IWorkItemFormState {
    hasActiveWorkItem: boolean;
    activeWorkItemId: number | undefined;
    isNew?: boolean;
    isReadOnly?: boolean;
}
