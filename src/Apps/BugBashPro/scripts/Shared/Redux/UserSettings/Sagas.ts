import { IUserSetting } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLeading } from "redux-saga/effects";
import { UserSettingActions, UserSettingActionTypes } from "./Actions";
import { fetchUserSettingsAsync, updateUserSettingAsync } from "./DataSource";
import { getUserSettingsStatus } from "./Selectors";

export function* userSettingSaga(): SagaIterator {
    yield takeLeading(UserSettingActionTypes.UserSettingsLoadRequested, loadUserSettings);
    yield takeLeading(UserSettingActionTypes.UserSettingUpdateRequested, updateUserSetting);
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
