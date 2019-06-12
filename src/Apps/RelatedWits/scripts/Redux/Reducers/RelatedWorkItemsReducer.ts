import { IdentityRef } from "azure-devops-extension-api/WebApi/WebApi";
import { CoreFieldRefNames } from "Common/Constants";
import { produce } from "immer";
import { applyFilterAndSort } from "../../Helpers";
import { RelatedWorkItemActions, RelatedWorkItemActionTypes } from "../Actions";
import { defaultRelatedWorkItemsState, IRelatedWorkItemsState } from "../Contracts";

export function relatedWorkItemsReducer(state: IRelatedWorkItemsState | undefined, action: RelatedWorkItemActions): IRelatedWorkItemsState {
    return produce(state || defaultRelatedWorkItemsState, draft => {
        switch (action.type) {
            case RelatedWorkItemActionTypes.BeginLoad: {
                draft.loading = true;
                draft.filteredItems = draft.workItems = draft.error = draft.propertyMap = undefined;
                break;
            }

            case RelatedWorkItemActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.filteredItems = draft.workItems = draft.propertyMap = undefined;
                draft.loading = false;
                break;
            }

            case RelatedWorkItemActionTypes.LoadSucceeded: {
                const workItems = action.payload;
                draft.workItems = workItems;
                draft.filteredItems = applyFilterAndSort(workItems, draft.filterState, draft.sortState);

                draft.propertyMap = {
                    [CoreFieldRefNames.AreaPath]: {},
                    [CoreFieldRefNames.WorkItemType]: {},
                    [CoreFieldRefNames.AssignedTo]: {},
                    [CoreFieldRefNames.State]: {}
                };

                for (const workItem of workItems) {
                    const areaPath = workItem.fields[CoreFieldRefNames.AreaPath];
                    const workItemType = workItem.fields[CoreFieldRefNames.WorkItemType];
                    const assignedTo: IdentityRef = workItem.fields[CoreFieldRefNames.AssignedTo];
                    const assignedToKey = assignedTo ? assignedTo.descriptor : "Undefined";
                    const state = workItem.fields[CoreFieldRefNames.State];

                    draft.propertyMap[CoreFieldRefNames.WorkItemType][workItemType] =
                        (draft.propertyMap[CoreFieldRefNames.WorkItemType][workItemType] || 0) + 1;
                    draft.propertyMap[CoreFieldRefNames.AreaPath][areaPath] = (draft.propertyMap[CoreFieldRefNames.AreaPath][areaPath] || 0) + 1;
                    draft.propertyMap[CoreFieldRefNames.State][state] = (draft.propertyMap[CoreFieldRefNames.State][state] || 0) + 1;
                    draft.propertyMap[CoreFieldRefNames.AssignedTo][assignedToKey] =
                        (draft.propertyMap[CoreFieldRefNames.AssignedTo][assignedToKey] || 0) + 1;
                }

                draft.loading = false;
                draft.error = undefined;
                break;
            }

            case RelatedWorkItemActionTypes.ApplyFilter: {
                const filterState = action.payload;
                draft.filterState = filterState;
                draft.filteredItems = applyFilterAndSort(draft.workItems, filterState, draft.sortState);
                break;
            }

            case RelatedWorkItemActionTypes.ApplySort: {
                const sortState = action.payload;
                draft.sortState = sortState;
                draft.filteredItems = applyFilterAndSort(draft.workItems, draft.filterState, sortState);
                break;
            }

            case RelatedWorkItemActionTypes.ClearSortAndFilter: {
                draft.filterState = draft.sortState = undefined;
                draft.filteredItems = draft.workItems ? [...draft.workItems] : [];
                break;
            }

            case RelatedWorkItemActionTypes.Clean: {
                draft.filteredItems = draft.workItems = draft.error = draft.propertyMap = undefined;
                draft.loading = false;
            }
        }
    });
}
