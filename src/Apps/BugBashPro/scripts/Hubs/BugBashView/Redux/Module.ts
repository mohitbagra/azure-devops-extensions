import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
import { BugBashViewActions } from "./Actions";
import { IBugBashViewAwareState } from "./Contracts";
import { bugBashViewReducer } from "./Reducers";
import { bugBashViewSaga } from "./Sagas";

export function getBugBashViewModule(bugBashId: string, initialBugBashItemId: string | undefined): ISagaModule<IBugBashViewAwareState> {
    const reducerMap: ReducersMapObject<IBugBashViewAwareState, BugBashViewActions> = {
        bugBashViewState: bugBashViewReducer
    };

    return {
        id: "bugBashView",
        reducerMap,
        initialActions: [BugBashViewActions.initialize(initialBugBashItemId)],
        sagas: [
            {
                saga: bugBashViewSaga,
                argument: bugBashId
            }
        ]
    };
}
