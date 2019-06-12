import { produce } from "immer";
import { RelatedWorkItemSettingsActions, RelatedWorkItemSettingsActionTypes } from "../Actions";
import { defaultSettingsState, ISettingsState } from "../Contracts";

export function settingsReducer(state: ISettingsState | undefined, action: RelatedWorkItemSettingsActions): ISettingsState {
    return produce(state || defaultSettingsState, draft => {
        switch (action.type) {
            case RelatedWorkItemSettingsActionTypes.BeginLoad: {
                draft.loading = true;
                break;
            }

            case RelatedWorkItemSettingsActionTypes.LoadSucceeded: {
                const { fields, top, sortByField } = action.payload;
                draft.settings = {
                    fields: { originalValue: fields, value: fields },
                    sortByField: { originalValue: sortByField, value: sortByField },
                    top: { originalValue: top!, value: top! }
                };
                draft.loading = false;
                break;
            }

            case RelatedWorkItemSettingsActionTypes.OpenPanel: {
                draft.isPanelOpen = true;
                break;
            }

            case RelatedWorkItemSettingsActionTypes.ClosePanel: {
                draft.isPanelOpen = false;
                if (draft.settings) {
                    draft.settings.fields.value = draft.settings.fields.originalValue;
                    draft.settings.sortByField.value = draft.settings.sortByField.originalValue;
                    draft.settings.top.value = draft.settings.top.originalValue;
                }
                break;
            }

            case RelatedWorkItemSettingsActionTypes.UpdateSettings: {
                const settings = action.payload;
                if (draft.settings) {
                    draft.settings.fields.value = settings.fields;
                    draft.settings.sortByField.value = settings.sortByField;
                    draft.settings.top.value = settings.top!;
                }
            }
        }
    });
}
