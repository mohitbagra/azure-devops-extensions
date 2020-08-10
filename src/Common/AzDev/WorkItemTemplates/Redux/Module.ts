import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";

import { TeamTemplatesActions, WorkItemTemplateActions } from "./Actions";
import { IWorkItemTemplateAwareState } from "./Contracts";
import { workItemTemplateReducer } from "./Reducers";
import { workItemTemplatesSaga } from "./Sagas";

export function getWorkItemTemplateModule(): ISagaModule<IWorkItemTemplateAwareState> {
    const reducerMap: ReducersMapObject<IWorkItemTemplateAwareState, TeamTemplatesActions | WorkItemTemplateActions> = {
        workItemTemplateState: workItemTemplateReducer
    };

    return {
        id: "workItemTemplates",
        reducerMap,
        sagas: [workItemTemplatesSaga]
    };
}
