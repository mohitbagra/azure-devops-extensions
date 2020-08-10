import { produce } from "immer";

import { ActiveWorkItemActions, ActiveWorkItemActionTypes } from "../Actions";
import { defaultActiveWorkItemState, IActiveWorkItemState } from "../Contracts";

export function activeWorkItemReducer(state: IActiveWorkItemState | undefined, action: ActiveWorkItemActions): IActiveWorkItemState {
    return produce(state || defaultActiveWorkItemState, (draft) => {
        switch (action.type) {
            case ActiveWorkItemActionTypes.SetActiveWorkItem: {
                const { links, queryableFields, sortableFields, relationTypes } = action.payload;

                draft.links = links;
                draft.queryableFields = queryableFields;
                draft.sortableFields = sortableFields;
                draft.relationTypes = relationTypes;
            }
        }
    });
}
