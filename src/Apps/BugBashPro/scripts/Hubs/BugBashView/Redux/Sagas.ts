import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { IBugBashItem, ISortState } from "BugBashPro/Shared/Contracts";
import { BugBashesActions, BugBashesActionTypes } from "BugBashPro/Shared/Redux/BugBashes";
import { BugBashItemsActions, BugBashItemsActionTypes, getAllBugBashItems, getResolvedWorkItemsMap } from "BugBashPro/Shared/Redux/BugBashItems";
import { getTeamsMap } from "Common/AzDev/Teams/Redux/Selectors";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import { ActionsOfType } from "Common/Redux";
import { SagaIterator } from "redux-saga";
import { put, select, takeEvery } from "redux-saga/effects";
import { BugBashViewPageErrorKey } from "../Constants";
import { getBugBashItemsFilterData, getFilteredBugBashItems } from "../Helpers";
import { BugBashViewActions, BugBashViewActionTypes } from "./Actions";
import { BugBashViewMode } from "./Contracts";
import { getBugBashItemsFilterState, getBugBashItemsSortState, getBugBashViewMode } from "./Selectors";

export function* bugBashViewSaga(): SagaIterator {
    yield takeEvery(BugBashViewActionTypes.SetViewMode, setViewMode);
    yield takeEvery(BugBashViewActionTypes.ApplyFilter, applyFilter);
    yield takeEvery(BugBashViewActionTypes.ApplySort, applySort);
    yield takeEvery(BugBashViewActionTypes.ClearSortAndFilter, clearSortAndFilter);

    yield takeEvery(BugBashesActionTypes.BugBashLoaded, bugBashLoaded);
    yield takeEvery(BugBashesActionTypes.BugBashUpdated, bugBashLoaded);

    yield takeEvery(BugBashItemsActionTypes.BugBashItemsLoaded, bugBashItemsLoaded);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemDeleteFailed, bugBashItemDeleteFailed);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemLoaded, bugBashItemLoadedOrCreatedOrUpdatedOrDeleted);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemDeleted, bugBashItemLoadedOrCreatedOrUpdatedOrDeleted);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemCreated, bugBashItemLoadedOrCreatedOrUpdatedOrDeleted);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemUpdated, bugBashItemLoadedOrCreatedOrUpdatedOrDeleted);
}

function* bugBashLoaded(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashLoaded | BugBashesActionTypes.BugBashUpdated>) {
    const bugBash = action.payload;

    if (bugBash.autoAccept) {
        const viewMode: BugBashViewMode = yield select(getBugBashViewMode);
        if (viewMode !== BugBashViewMode.Accepted) {
            yield put(BugBashViewActions.setViewMode(BugBashViewMode.Accepted));
        }
    }
}

function* setViewMode(action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.SetViewMode>): SagaIterator {
    const viewMode = action.payload;
    const allBugBashItems: IBugBashItem[] | undefined = yield select(getAllBugBashItems);
    const resolvedWorkItemsMap: { [id: number]: WorkItem } | undefined = yield select(getResolvedWorkItemsMap);
    const teamsMap: { [idOrName: string]: WebApiTeam } | undefined = yield select(getTeamsMap);
    const filterState: IFilterState | undefined = yield select(getBugBashItemsFilterState);
    const sortState: ISortState | undefined = yield select(getBugBashItemsSortState);
    const filteredBugBashItems = getFilteredBugBashItems(allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);
    yield put(BugBashViewActions.setFilteredItems(filteredBugBashItems));
}

function* applyFilter(action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.ApplyFilter>): SagaIterator {
    const filterState = action.payload;
    const allBugBashItems: IBugBashItem[] | undefined = yield select(getAllBugBashItems);
    const resolvedWorkItemsMap: { [id: number]: WorkItem } | undefined = yield select(getResolvedWorkItemsMap);
    const teamsMap: { [idOrName: string]: WebApiTeam } | undefined = yield select(getTeamsMap);
    const viewMode: BugBashViewMode = yield select(getBugBashViewMode);
    const sortState: ISortState | undefined = yield select(getBugBashItemsSortState);
    const filteredBugBashItems = getFilteredBugBashItems(allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);
    yield put(BugBashViewActions.setFilteredItems(filteredBugBashItems));
}

function* applySort(action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.ApplySort>): SagaIterator {
    const sortState = action.payload;
    const allBugBashItems: IBugBashItem[] | undefined = yield select(getAllBugBashItems);
    const resolvedWorkItemsMap: { [id: number]: WorkItem } | undefined = yield select(getResolvedWorkItemsMap);
    const teamsMap: { [idOrName: string]: WebApiTeam } | undefined = yield select(getTeamsMap);
    const filterState: IFilterState | undefined = yield select(getBugBashItemsFilterState);
    const viewMode: BugBashViewMode = yield select(getBugBashViewMode);
    const filteredBugBashItems = getFilteredBugBashItems(allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);
    yield put(BugBashViewActions.setFilteredItems(filteredBugBashItems));
}

function* clearSortAndFilter(): SagaIterator {
    const allBugBashItems: IBugBashItem[] | undefined = yield select(getAllBugBashItems);
    const resolvedWorkItemsMap: { [id: number]: WorkItem } | undefined = yield select(getResolvedWorkItemsMap);
    const teamsMap: { [idOrName: string]: WebApiTeam } | undefined = yield select(getTeamsMap);
    const viewMode: BugBashViewMode = yield select(getBugBashViewMode);
    const filteredBugBashItems = getFilteredBugBashItems(allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, undefined, undefined);
    yield put(BugBashViewActions.setFilteredItems(filteredBugBashItems));
}

function* bugBashItemDeleteFailed(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemDeleteFailed>): SagaIterator {
    const { error } = action.payload;
    yield put(KeyValuePairActions.pushEntry(BugBashViewPageErrorKey, error));
}

function* bugBashItemsLoaded(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemsLoaded>): SagaIterator {
    const { bugBashItems, resolvedWorkItems } = action.payload;
    const teamsMap: { [idOrName: string]: WebApiTeam } | undefined = yield select(getTeamsMap);
    const viewMode: BugBashViewMode = yield select(getBugBashViewMode);
    const filterState: IFilterState | undefined = yield select(getBugBashItemsFilterState);
    const sortState: ISortState | undefined = yield select(getBugBashItemsSortState);
    const filteredBugBashItems = getFilteredBugBashItems(bugBashItems, resolvedWorkItems, teamsMap, viewMode, filterState, sortState);
    yield put(BugBashViewActions.setFilteredItems(filteredBugBashItems));

    const filterData = getBugBashItemsFilterData(bugBashItems, resolvedWorkItems);
    yield put(BugBashViewActions.setFilterData(filterData));
}

function* bugBashItemLoadedOrCreatedOrUpdatedOrDeleted(): SagaIterator {
    const allBugBashItems: IBugBashItem[] | undefined = yield select(getAllBugBashItems);
    const resolvedWorkItemsMap: { [id: number]: WorkItem } | undefined = yield select(getResolvedWorkItemsMap);
    const teamsMap: { [idOrName: string]: WebApiTeam } | undefined = yield select(getTeamsMap);
    const viewMode: BugBashViewMode = yield select(getBugBashViewMode);
    const filterState: IFilterState | undefined = yield select(getBugBashItemsFilterState);
    const sortState: ISortState | undefined = yield select(getBugBashItemsSortState);
    const filteredBugBashItems = getFilteredBugBashItems(allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);
    yield put(BugBashViewActions.setFilteredItems(filteredBugBashItems));

    const filterData = getBugBashItemsFilterData(allBugBashItems, resolvedWorkItemsMap);
    yield put(BugBashViewActions.setFilterData(filterData));
}
