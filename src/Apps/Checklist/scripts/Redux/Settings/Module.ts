import { ReducersMapObject } from "redux";
import { IModule } from "redux-dynamic-modules";

import { ChecklistSettingsActions } from "./Actions";
import { IChecklistSettingsAwareState } from "./Contracts";
import { checklistSettingsReducer } from "./Reducers";

export function getChecklistSettingsModule(): IModule<IChecklistSettingsAwareState> {
    const reducerMap: ReducersMapObject<IChecklistSettingsAwareState, ChecklistSettingsActions> = {
        checklistSettingsState: checklistSettingsReducer
    };

    return {
        id: "checklistSettings",
        reducerMap
    };
}
