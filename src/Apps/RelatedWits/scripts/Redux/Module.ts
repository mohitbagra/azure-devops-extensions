import { AnyAction, ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { IRelatedWitsAwareState } from "./Contracts";
import { activeWorkItemReducer } from "./Reducers/ActiveWorkItemReducer";
import { relatedWorkItemsReducer } from "./Reducers/RelatedWorkItemsReducer";
import { settingsReducer } from "./Reducers/SettingsReducer";
import { relatedWitsSaga } from "./Sagas";

export function getRelatedWitsModule(): ISagaModule<IRelatedWitsAwareState> {
    const reducerMap: ReducersMapObject<IRelatedWitsAwareState, AnyAction> = {
        settingsState: settingsReducer,
        relatedWorkItemsState: relatedWorkItemsReducer,
        activeWorkItemState: activeWorkItemReducer
    };

    return {
        id: "relatedWits",
        reducerMap,
        sagas: [relatedWitsSaga]
    };
}
