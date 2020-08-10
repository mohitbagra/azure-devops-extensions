import { LoadStatus } from "Common/Contracts";
import { ActionsOfType, RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";

import { ProjectSettingActions, ProjectSettingActionTypes } from "./Actions";
import { fetchProjectSettingAsync, updateProjectSettingAsync } from "./DataSource";
import { getProjectSettingStatus } from "./Selectors";

export function* projectSettingSaga(): SagaIterator {
    yield takeLeading(ProjectSettingActionTypes.ProjectSettingLoadRequested, loadProjectSetting);
    yield takeLeading(ProjectSettingActionTypes.ProjectSettingUpdateRequested, updateProjectSetting);
}

function* loadProjectSetting(): SagaIterator {
    const status: RT<typeof getProjectSettingStatus> = yield select(getProjectSettingStatus);

    if (status !== LoadStatus.Loading) {
        yield put(ProjectSettingActions.beginLoadProjectSetting());
        const data: RT<typeof fetchProjectSettingAsync> = yield call(fetchProjectSettingAsync);
        yield put(ProjectSettingActions.projectSettingLoaded(data));
    }
}

function* updateProjectSetting(action: ActionsOfType<ProjectSettingActions, ProjectSettingActionTypes.ProjectSettingUpdateRequested>): SagaIterator {
    const projectSetting = action.payload;
    const status: RT<typeof getProjectSettingStatus> = yield select(getProjectSettingStatus);

    if (status !== LoadStatus.Loading) {
        const data: RT<typeof updateProjectSettingAsync> = yield call(updateProjectSettingAsync, projectSetting);
        yield put(ProjectSettingActions.projectSettingUpdated(data));
    }
}
