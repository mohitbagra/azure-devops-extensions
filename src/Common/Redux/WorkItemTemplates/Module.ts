import {
    TeamTemplatesActions, WorkItemTemplateActions
} from "Common/Redux/WorkItemTemplates/Actions";
import { IWorkItemTemplateAwareState } from "Common/Redux/WorkItemTemplates/Contracts";
import { workItemTemplateReducer } from "Common/Redux/WorkItemTemplates/Reducers";
import { ReducersMapObject } from "redux";
import { ISagaModule } from "redux-dynamic-modules-saga";
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
