import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import {
    IWorkItem, IWorkItemAwareState, IWorkItemState, WorkItemStatus
} from "Common/Redux/WorkItems/Contracts";
import { createSelector } from "reselect";

export function getWorkItemState(state: IWorkItemAwareState): IWorkItemState | undefined {
    return state.workItemState;
}

export function getWorkItem(state: IWorkItemAwareState, id: number): WorkItem | undefined {
    const workItemState = getWorkItemState(state);
    return workItemState && workItemState.workItemsMap[id];
}

const _getWorkItems = (state: IWorkItemAwareState, ids: number[]): IWorkItem[] => {
    const map = getWorkItemsMap(state);
    if (!map) {
        return [];
    }

    const arr: IWorkItem[] = [];
    for (const id of ids) {
        arr.push(map[id]);
    }
    return arr;
};

export const getWorkItems = createSelector(
    [_getWorkItems],
    workItems => workItems
);

export const areWorkItemsLoaded = createSelector(
    [getWorkItems],
    (workItems: IWorkItem[]) => workItems.every(w => w !== undefined && w.status !== WorkItemStatus.Loading)
);

export const getWorkItemsMap = createSelector(
    getWorkItemState,
    (state: IWorkItemState | undefined) => state && state.workItemsMap
);

export const getWorkItemsArr = createSelector(
    getWorkItemsMap,
    (workItemsMap: { [id: number]: IWorkItem } | undefined) => {
        if (workItemsMap) {
            const arr: WorkItem[] = [];
            for (const id of Object.keys(workItemsMap)) {
                arr.push(workItemsMap[parseInt(id, 10)]);
            }

            return arr;
        }

        return undefined;
    }
);
