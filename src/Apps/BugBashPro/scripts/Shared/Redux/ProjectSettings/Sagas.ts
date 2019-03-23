import { IProjectSetting } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { ProjectSettingActions, ProjectSettingActionTypes } from "./Actions";
import { fetchProjectSettingAsync, updateProjectSettingAsync } from "./DataSource";
import { getProjectSettingStatus } from "./Selectors";

export function* projectSettingSaga(): SagaIterator {
    yield takeEvery(ProjectSettingActionTypes.ProjectSettingLoadRequested, loadProjectSetting);
    yield takeEvery(ProjectSettingActionTypes.ProjectSettingUpdateRequested, updateProjectSetting);
}

function* loadProjectSetting(): SagaIterator {
    const status: LoadStatus = yield select(getProjectSettingStatus);

    if (status !== LoadStatus.Loading) {
        yield put(ProjectSettingActions.beginLoadProjectSetting());
        const data: IProjectSetting = yield call(fetchProjectSettingAsync);
        yield put(ProjectSettingActions.projectSettingLoaded(data));
    }
}

function* updateProjectSetting(action: ActionsOfType<ProjectSettingActions, ProjectSettingActionTypes.ProjectSettingUpdateRequested>): SagaIterator {
    const projectSetting = action.payload;
    const status: LoadStatus = yield select(getProjectSettingStatus);

    if (status !== LoadStatus.Loading) {
        const data: IProjectSetting = yield call(updateProjectSettingAsync, projectSetting);
        yield put(ProjectSettingActions.projectSettingUpdated(data));
    }
}
