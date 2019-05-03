import { readLocalSetting, writeLocalSetting } from "Common/Utilities/LocalStorageService";
import { produce } from "immer";
import { ChecklistSettingsActions, ChecklistSettingsActionTypes } from "./Actions";
import { IChecklistSettingsState } from "./Contracts";

const defaultState: IChecklistSettingsState = {
    initialized: false,
    wordWrap: false,
    hideCompletedItems: false
};

export function checklistSettingsReducer(state: IChecklistSettingsState | undefined, action: ChecklistSettingsActions): IChecklistSettingsState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case ChecklistSettingsActionTypes.Initialize: {
                if (!draft.initialized) {
                    const wordWrapLocalData = readLocalSetting("checklist_wordWrap", "0");
                    const hideCompletedItemsLocalData = readLocalSetting("checklist_hideCompletedItems", "0");
                    draft.wordWrap = wordWrapLocalData === "0" ? false : true;
                    draft.hideCompletedItems = hideCompletedItemsLocalData === "0" ? false : true;
                    draft.initialized = true;
                }
                break;
            }

            case ChecklistSettingsActionTypes.ToggleWordWrap: {
                if (draft.initialized) {
                    writeLocalSetting("checklist_wordWrap", draft.wordWrap ? "0" : "1");
                    draft.wordWrap = !draft.wordWrap;
                }
                break;
            }

            case ChecklistSettingsActionTypes.ToggleHideCompletedItems: {
                if (draft.initialized) {
                    writeLocalSetting("checklist_hideCompletedItems", draft.hideCompletedItems ? "0" : "1");
                    draft.hideCompletedItems = !draft.hideCompletedItems;
                }
                break;
            }
        }
    });
}
