export interface IWorkItemFormAwareState {
    workItemFormState: IWorkItemFormState;
}

export interface IWorkItemFormState {
    activeWorkItemId: number | undefined;
    isNew?: boolean;
    isReadOnly?: boolean;
}
