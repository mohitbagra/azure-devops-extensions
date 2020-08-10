import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { ChecklistActions } from "./Actions";
import { IChecklistAwareState } from "./Contracts";
import { checklistReducer } from "./Reducers";
import { checklistSaga } from "./Sagas";

export function getChecklistModule(): ISagaModule<IChecklistAwareState> {
    const reducerMap: ReducersMapObject<IChecklistAwareState, ChecklistActions> = {
        checklistState: checklistReducer
    };

    return {
        id: "checklist",
        reducerMap,
        sagas: [checklistSaga]
    };
}
