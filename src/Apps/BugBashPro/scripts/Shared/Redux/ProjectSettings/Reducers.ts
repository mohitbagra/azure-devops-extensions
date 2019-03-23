import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { ProjectSettingActions, ProjectSettingActionTypes } from "./Actions";
import { defaultProjectSettingState, IProjectSettingState } from "./Contracts";

export function projectSettingReducer(state: IProjectSettingState | undefined, action: ProjectSettingActions): IProjectSettingState {
    return produce(state || defaultProjectSettingState, draft => {
        switch (action.type) {
            case ProjectSettingActionTypes.BeginLoadProjectSetting: {
                draft.status = LoadStatus.Loading;
                draft.settings = undefined;
                draft.error = undefined;
                break;
            }

            case ProjectSettingActionTypes.ProjectSettingLoaded: {
                draft.settings = action.payload;
                draft.status = LoadStatus.Ready;
                draft.error = undefined;
                break;
            }

            case ProjectSettingActionTypes.ProjectSettingUpdated: {
                draft.settings = action.payload;
            }
        }
    });
}
