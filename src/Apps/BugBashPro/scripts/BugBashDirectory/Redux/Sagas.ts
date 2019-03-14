import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import {
    BugBashesActions, BugBashesActionTypes, getAllBugBashes
} from "BugBashPro/Redux/BugBashes";
import { IBugBash, ISortState } from "BugBashPro/Shared/Contracts";
import { ActionsOfType } from "Common/Redux/Helpers";
import { KeyValurPairActions } from "Common/Redux/KeyValuePair";
import { SagaIterator } from "redux-saga";
import { put, select, takeEvery } from "redux-saga/effects";
import { DirectoryPageErrorKey } from "../Constants";
import { getFilteredBugBashes } from "../Helpers";
import { BugBashDirectoryActions, BugBashDirectoryActionTypes } from "./Actions";
import { BugBashDirectoryTabId } from "./Contracts";
import {
    getBugBashDirectorySelectedTab, getBugBashesFilterState, getBugBashesSortState
} from "./Selectors";

export function* bugBashDirectorySaga(): SagaIterator {
    yield takeEvery(BugBashDirectoryActionTypes.SelectTab, selectTab);
    yield takeEvery(BugBashDirectoryActionTypes.ApplyFilter, applyFilter);
    yield takeEvery(BugBashDirectoryActionTypes.ApplySort, applySort);
    yield takeEvery(BugBashDirectoryActionTypes.ClearSortAndFilter, clearSortAndFilter);

    yield takeEvery(BugBashesActionTypes.BugBashDeleteFailed, bugBashDeleteFailed);
    yield takeEvery(BugBashesActionTypes.BugBashLoaded, bugBashLoadedOrCreatedOrUpdatedOrDeleted);
    yield takeEvery(BugBashesActionTypes.BugBashDeleted, bugBashLoadedOrCreatedOrUpdatedOrDeleted);
    yield takeEvery(BugBashesActionTypes.BugBashCreated, bugBashLoadedOrCreatedOrUpdatedOrDeleted);
    yield takeEvery(BugBashesActionTypes.BugBashUpdated, bugBashLoadedOrCreatedOrUpdatedOrDeleted);
}

function* selectTab(action: ActionsOfType<BugBashDirectoryActions, BugBashDirectoryActionTypes.SelectTab>): SagaIterator {
    const selectedTabId = action.payload;
    const allBugBashes: IBugBash[] | undefined = yield select(getAllBugBashes);
    const filterState: IFilterState | undefined = yield select(getBugBashesFilterState);
    const sortState: ISortState | undefined = yield select(getBugBashesSortState);
    const { filteredBugBashes, counts } = getFilteredBugBashes(allBugBashes, selectedTabId, filterState, sortState);
    yield put(BugBashDirectoryActions.setFilteredItems(filteredBugBashes, counts));
}

function* applyFilter(action: ActionsOfType<BugBashDirectoryActions, BugBashDirectoryActionTypes.ApplyFilter>): SagaIterator {
    const filterState = action.payload;
    const allBugBashes: IBugBash[] | undefined = yield select(getAllBugBashes);
    const selectedTabId: BugBashDirectoryTabId = yield select(getBugBashDirectorySelectedTab);
    const sortState: ISortState | undefined = yield select(getBugBashesSortState);
    const { filteredBugBashes, counts } = getFilteredBugBashes(allBugBashes, selectedTabId, filterState, sortState);
    yield put(BugBashDirectoryActions.setFilteredItems(filteredBugBashes, counts));
}

function* applySort(action: ActionsOfType<BugBashDirectoryActions, BugBashDirectoryActionTypes.ApplySort>): SagaIterator {
    const sortState = action.payload;
    const allBugBashes: IBugBash[] | undefined = yield select(getAllBugBashes);
    const selectedTabId: BugBashDirectoryTabId = yield select(getBugBashDirectorySelectedTab);
    const filterState: IFilterState | undefined = yield select(getBugBashesFilterState);
    const { filteredBugBashes, counts } = getFilteredBugBashes(allBugBashes, selectedTabId, filterState, sortState);
    yield put(BugBashDirectoryActions.setFilteredItems(filteredBugBashes, counts));
}

function* clearSortAndFilter(): SagaIterator {
    const allBugBashes: IBugBash[] | undefined = yield select(getAllBugBashes);
    const selectedTabId: BugBashDirectoryTabId = yield select(getBugBashDirectorySelectedTab);
    const { filteredBugBashes, counts } = getFilteredBugBashes(allBugBashes, selectedTabId, undefined, undefined);
    yield put(BugBashDirectoryActions.setFilteredItems(filteredBugBashes, counts));
}

function* bugBashDeleteFailed(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashDeleteFailed>): SagaIterator {
    const { error } = action.payload;
    yield put(KeyValurPairActions.pushEntry(DirectoryPageErrorKey, error));
}

function* bugBashLoadedOrCreatedOrUpdatedOrDeleted(): SagaIterator {
    const allBugBashes: IBugBash[] | undefined = yield select(getAllBugBashes);
    const selectedTabId: BugBashDirectoryTabId = yield select(getBugBashDirectorySelectedTab);
    const filterState: IFilterState | undefined = yield select(getBugBashesFilterState);
    const sortState: ISortState | undefined = yield select(getBugBashesSortState);
    const { filteredBugBashes, counts } = getFilteredBugBashes(allBugBashes, selectedTabId, filterState, sortState);
    yield put(BugBashDirectoryActions.setFilteredItems(filteredBugBashes, counts));
}
