import { ILongText } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { BugBashDetailActions, BugBashDetailActionTypes } from "./Actions";
import { fetchBugBashDetailsAsync } from "./DataSource";
import { getBugBashDetailsStatus } from "./Selectors";

export function* bugBashDetailsSaga(): SagaIterator {
    yield takeEvery(BugBashDetailActionTypes.BugBashDetailsLoadRequested, loadBugBashDetails);
}

function* loadBugBashDetails(action: ActionsOfType<BugBashDetailActions, BugBashDetailActionTypes.BugBashDetailsLoadRequested>): SagaIterator {
    const bugBashId = action.payload;
    const status: LoadStatus = yield select(getBugBashDetailsStatus, bugBashId);

    if (status !== LoadStatus.Loading && status !== LoadStatus.Updating) {
        yield put(BugBashDetailActions.beginLoadBugBashDetails(bugBashId));
        const details: ILongText = yield call(fetchBugBashDetailsAsync, bugBashId);
        yield put(BugBashDetailActions.bugBashDetailsLoaded(bugBashId, details));
    }
}
