import { TagActions, TagActionTypes } from "Common/Redux/Tags/Actions";
import { defaultState, ITagState } from "Common/Redux/Tags/Contracts";
import { produce } from "immer";

export function tagReducer(state: ITagState | undefined, action: TagActions): ITagState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case TagActionTypes.BeginLoad: {
                draft.loading = true;
                draft.tags = undefined;
                draft.error = undefined;
                break;
            }

            case TagActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.tags = undefined;
                draft.loading = false;
                break;
            }

            case TagActionTypes.LoadSucceeded: {
                draft.tags = action.payload;
                draft.loading = false;
                draft.error = undefined;
            }
        }
    });
}
