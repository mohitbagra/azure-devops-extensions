import { IProjectSetting, IUserSetting, LoadStatus } from "BugBashPro/Shared/Contracts";
import { ActionsOfType } from "Common/Redux/Helpers";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
    ProjectSettingActions, ProjectSettingActionTypes, UserSettingActions, UserSettingActionTypes
} from "./Actions";
import {
    fetchProjectSettingAsync, fetchUserSettingsAsync, updateProjectSettingAsync,
    updateUserSettingAsync
} from "./DataSource";
import { getProjectSettingStatus, getUserSettingsStatus } from "./Selectors";

export function* projectSettingSaga(): SagaIterator {
    yield takeEvery(ProjectSettingActionTypes.ProjectSettingLoadRequested, loadProjectSetting);
    yield takeEvery(ProjectSettingActionTypes.ProjectSettingUpdateRequested, updateProjectSetting);
}

export function* userSettingSaga(): SagaIterator {
    yield takeEvery(UserSettingActionTypes.UserSettingsLoadRequested, loadUserSettings);
    yield takeEvery(UserSettingActionTypes.UserSettingUpdateRequested, updateUserSetting);
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

function* loadUserSettings(): SagaIterator {
    const status: LoadStatus = yield select(getUserSettingsStatus);

    if (status !== LoadStatus.Loading) {
        yield put(UserSettingActions.beginLoadUserSettings());
        const data: IUserSetting[] = yield call(fetchUserSettingsAsync);
        yield put(UserSettingActions.userSettingsLoaded(data));
    }
}

function* updateUserSetting(action: ActionsOfType<UserSettingActions, UserSettingActionTypes.UserSettingUpdateRequested>): SagaIterator {
    const userSetting = action.payload;
    const status: LoadStatus = yield select(getUserSettingsStatus);

    if (status !== LoadStatus.Loading) {
        const data: IUserSetting = yield call(updateUserSettingAsync, userSetting);
        yield put(UserSettingActions.userSettingUpdated(data));
    }
}
