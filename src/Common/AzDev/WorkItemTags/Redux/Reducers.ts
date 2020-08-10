import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";

import { TagActions, TagActionTypes } from "./Actions";
import { defaultState, ITagState } from "./Contracts";

export function tagReducer(state: ITagState | undefined, action: TagActions): ITagState {
    return produce(state || defaultState, (draft) => {
        switch (action.type) {
            case TagActionTypes.BeginLoad: {
                draft.status = LoadStatus.Loading;
                draft.tags = undefined;
                draft.error = undefined;
                break;
            }

            case TagActionTypes.LoadFailed: {
                draft.error = action.payload;
                draft.tags = undefined;
                draft.status = LoadStatus.LoadFailed;
                break;
            }

            case TagActionTypes.LoadSucceeded: {
                draft.tags = action.payload;
                draft.status = LoadStatus.Ready;
                draft.error = undefined;
            }
        }
    });
}
