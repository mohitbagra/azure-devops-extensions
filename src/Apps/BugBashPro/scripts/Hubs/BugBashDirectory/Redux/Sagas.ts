import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { IBugBash, ISortState } from "BugBashPro/Shared/Contracts";
import { BugBashesActions, BugBashesActionTypes } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { getAllBugBashes } from "BugBashPro/Shared/Redux/BugBashes/Selectors";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import { ActionsOfType, RT } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { DirectoryPageErrorKey } from "../Constants";
import { getFilteredBugBashes } from "../Helpers";
import { BugBashDirectoryActions, BugBashDirectoryActionTypes } from "./Actions";
import { BugBashDirectoryTabId } from "./Contracts";
import { getBugBashDirectorySelectedTab, getBugBashesFilterState, getBugBashesSortState } from "./Selectors";

export function* bugBashDirectorySaga(): SagaIterator {
    yield takeEvery(BugBashDirectoryActionTypes.SelectTab, selectTab);
    yield takeEvery(BugBashDirectoryActionTypes.ApplyFilter, applyFilter);
    yield takeEvery(BugBashDirectoryActionTypes.ApplySort, applySort);
    yield takeEvery(BugBashDirectoryActionTypes.ClearSortAndFilter, clearSortAndFilter);

    yield takeEvery(BugBashesActionTypes.BugBashDeleteFailed, bugBashDeleteFailed);
    yield takeEvery(
        [
            BugBashesActionTypes.BugBashCreated,
            BugBashesActionTypes.BugBashUpdated,
            BugBashesActionTypes.BugBashLoaded,
            BugBashesActionTypes.BugBashDeleted
        ],
        bugBashLoadedOrCreatedOrUpdatedOrDeleted
    );
}

function* refreshFilteredItems(
    allBugBashes: IBugBash[] | undefined,
    filterState: IFilterState | undefined,
    sortState: ISortState | undefined,
    selectedTabId: BugBashDirectoryTabId
): SagaIterator {
    const { filteredBugBashes, counts } = getFilteredBugBashes(allBugBashes, selectedTabId, filterState, sortState);
    yield put(BugBashDirectoryActions.setFilteredItems(filteredBugBashes, counts));
}

function* selectTab(action: ActionsOfType<BugBashDirectoryActions, BugBashDirectoryActionTypes.SelectTab>): SagaIterator {
    const selectedTabId = action.payload;
    const [allBugBashes, filterState, sortState]: [
        RT<typeof getAllBugBashes>,
        RT<typeof getBugBashesFilterState>,
        RT<typeof getBugBashesSortState>
    ] = yield all([select(getAllBugBashes), select(getBugBashesFilterState), select(getBugBashesSortState)]);
    yield call(refreshFilteredItems, allBugBashes, filterState, sortState, selectedTabId);
}

function* applyFilter(action: ActionsOfType<BugBashDirectoryActions, BugBashDirectoryActionTypes.ApplyFilter>): SagaIterator {
    const filterState = action.payload;
    const [allBugBashes, selectedTabId, sortState]: [
        RT<typeof getAllBugBashes>,
        RT<typeof getBugBashDirectorySelectedTab>,
        RT<typeof getBugBashesSortState>
    ] = yield all([select(getAllBugBashes), select(getBugBashDirectorySelectedTab), select(getBugBashesSortState)]);
    yield call(refreshFilteredItems, allBugBashes, filterState, sortState, selectedTabId);
}

function* applySort(action: ActionsOfType<BugBashDirectoryActions, BugBashDirectoryActionTypes.ApplySort>): SagaIterator {
    const sortState = action.payload;
    const [allBugBashes, selectedTabId, filterState]: [
        RT<typeof getAllBugBashes>,
        RT<typeof getBugBashDirectorySelectedTab>,
        RT<typeof getBugBashesFilterState>
    ] = yield all([select(getAllBugBashes), select(getBugBashDirectorySelectedTab), select(getBugBashesFilterState)]);
    yield call(refreshFilteredItems, allBugBashes, filterState, sortState, selectedTabId);
}

function* clearSortAndFilter(): SagaIterator {
    const [allBugBashes, selectedTabId]: [RT<typeof getAllBugBashes>, RT<typeof getBugBashDirectorySelectedTab>] = yield all([
        select(getAllBugBashes),
        select(getBugBashDirectorySelectedTab)
    ]);
    yield call(refreshFilteredItems, allBugBashes, undefined, undefined, selectedTabId);
}

function* bugBashDeleteFailed(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashDeleteFailed>): SagaIterator {
    const { error } = action.payload;
    yield put(KeyValuePairActions.pushEntry(DirectoryPageErrorKey, error));
}

function* bugBashLoadedOrCreatedOrUpdatedOrDeleted(): SagaIterator {
    const [allBugBashes, selectedTabId, filterState, sortState]: [
        RT<typeof getAllBugBashes>,
        RT<typeof getBugBashDirectorySelectedTab>,
        RT<typeof getBugBashesFilterState>,
        RT<typeof getBugBashesSortState>
    ] = yield all([select(getAllBugBashes), select(getBugBashDirectorySelectedTab), select(getBugBashesFilterState), select(getBugBashesSortState)]);
    yield call(refreshFilteredItems, allBugBashes, filterState, sortState, selectedTabId);
}
