import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { UserSettingActions } from "./Actions";
import { IBugBashSettingsAwareState } from "./Contracts";
import { userSettingReducer } from "./Reducers";
import { userSettingSaga } from "./Sagas";

export function getBugBashUserSettingsModule(): ISagaModule<IBugBashSettingsAwareState> {
    const reducerMap: ReducersMapObject<IBugBashSettingsAwareState, UserSettingActions> = {
        userSettingState: userSettingReducer
    };

    return {
        id: "bugBashUserSettings",
        reducerMap,
        sagas: [userSettingSaga]
    };
}
