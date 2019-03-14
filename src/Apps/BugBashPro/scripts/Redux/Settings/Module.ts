import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { ProjectSettingActions, UserSettingActions } from "./Actions";
import { IBugBashSettingsAwareState } from "./Contracts";
import { projectSettingReducer, userSettingReducer } from "./Reducers";
import { projectSettingSaga, userSettingSaga } from "./Sagas";

export function getBugBashSettingsModule(): ISagaModule<IBugBashSettingsAwareState> {
    const reducerMap: ReducersMapObject<IBugBashSettingsAwareState, UserSettingActions & ProjectSettingActions> = {
        userSettingState: userSettingReducer,
        projectSettingState: projectSettingReducer
    };

    return {
        id: "bugBashSettings",
        reducerMap,
        sagas: [projectSettingSaga, userSettingSaga]
    };
}
