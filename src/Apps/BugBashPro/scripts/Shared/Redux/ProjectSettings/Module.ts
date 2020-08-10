import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { ProjectSettingActions } from "./Actions";
import { IBugBashSettingsAwareState } from "./Contracts";
import { projectSettingReducer } from "./Reducers";
import { projectSettingSaga } from "./Sagas";

export function getBugBashProjectSettingsModule(): ISagaModule<IBugBashSettingsAwareState> {
    const reducerMap: ReducersMapObject<IBugBashSettingsAwareState, ProjectSettingActions> = {
        projectSettingState: projectSettingReducer
    };

    return {
        id: "bugBashProjectSettings",
        reducerMap,
        sagas: [projectSettingSaga]
    };
}
