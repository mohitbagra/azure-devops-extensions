import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { RelatedWorkItemSettingsActions, RelatedWorkItemSettingsActionTypes } from "../Actions";
import { defaultSettingsState, ISettingsState } from "../Contracts";

export function settingsReducer(state: ISettingsState | undefined, action: RelatedWorkItemSettingsActions): ISettingsState {
    return produce(state || defaultSettingsState, draft => {
        switch (action.type) {
            case RelatedWorkItemSettingsActionTypes.BeginLoad: {
                draft.status = LoadStatus.Loading;
                break;
            }

            case RelatedWorkItemSettingsActionTypes.LoadSucceeded: {
                const { fields, top, sortByField } = action.payload;
                draft.settings = {
                    fields,
                    sortByField,
                    top
                };
                draft.status = LoadStatus.Ready;
                break;
            }

            case RelatedWorkItemSettingsActionTypes.OpenPanel: {
                draft.isPanelOpen = true;
                break;
            }

            case RelatedWorkItemSettingsActionTypes.ClosePanel: {
                draft.isPanelOpen = false;
                break;
            }

            case RelatedWorkItemSettingsActionTypes.UpdateSettings: {
                const settings = action.payload;
                if (draft.settings) {
                    draft.settings.fields = settings.fields;
                    draft.settings.sortByField = settings.sortByField;
                    draft.settings.top = settings.top;
                }
            }
        }
    });
}
