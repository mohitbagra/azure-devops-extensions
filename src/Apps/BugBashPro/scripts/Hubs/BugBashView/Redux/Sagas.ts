import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { BugBashPortalActions } from "BugBashPro/Portals/BugBashPortal/Redux/Actions";
import { Resources } from "BugBashPro/Resources";
import { IBugBashItem, ISortState } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { BugBashesActions, BugBashesActionTypes } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { BugBashItemsActions, BugBashItemsActionTypes } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { getAllBugBashItems, getBugBashItem, getResolvedWorkItemsMap } from "BugBashPro/Shared/Redux/BugBashItems/Selectors";
import { getTeamsMap } from "Common/AzDev/Teams/Redux/Selectors";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import { ActionsOfType, RT } from "Common/Redux";
import { addToast } from "Common/ServiceWrappers/GlobalMessageService";
import { openNewWindow, reloadPage } from "Common/ServiceWrappers/HostNavigationService";
import { openWorkItem } from "Common/ServiceWrappers/WorkItemNavigationService";
import { getWorkItemUrlAsync } from "Common/Utilities/UrlHelper";
import { Channel, channel, SagaIterator } from "redux-saga";
import { all, call, delay, put, race, select, take, takeEvery } from "redux-saga/effects";
import { BugBashViewPageErrorKey } from "../Constants";
import { getBugBashItemsFilterData, getFilteredBugBashItems } from "../Helpers";
import { BugBashViewActions, BugBashViewActionTypes } from "./Actions";
import { BugBashViewMode } from "./Contracts";
import { getBugBashItemsFilterState, getBugBashItemsSortState, getBugBashViewMode } from "./Selectors";

export function* bugBashViewSaga(bugBashId: string): SagaIterator {
    yield takeEvery(BugBashViewActionTypes.Initialize, initializeView);
    yield takeEvery(BugBashViewActionTypes.SetViewMode, setViewMode);
    yield takeEvery(BugBashViewActionTypes.ApplyFilter, applyFilter);
    yield takeEvery(BugBashViewActionTypes.ApplySort, applySort);
    yield takeEvery(BugBashViewActionTypes.ClearSortAndFilter, clearSortAndFilter);
    yield takeEvery(BugBashViewActionTypes.EditBugBashItemRequested, editBugBashItemRequested, bugBashId);
    yield takeEvery(BugBashViewActionTypes.DismissBugBashItemPortalRequested, onBugBashItemPortalDismissed, bugBashId);

    yield takeEvery(BugBashesActionTypes.BugBashLoaded, bugBashLoaded);
    yield takeEvery(BugBashesActionTypes.BugBashUpdated, bugBashUpdated);

    yield takeEvery(BugBashItemsActionTypes.BugBashItemsLoaded, bugBashItemsLoaded);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemDeleteFailed, bugBashItemDeleteFailed);

    yield takeEvery(
        [
            BugBashItemsActionTypes.BugBashItemLoaded,
            BugBashItemsActionTypes.BugBashItemUpdated,
            BugBashItemsActionTypes.BugBashItemCreated,
            BugBashItemsActionTypes.BugBashItemDeleted
        ],
        bugBashItemLoadedOrCreatedOrUpdatedOrDeleted
    );
}

function* initializeView(action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.Initialize>) {
    const initialBugBashItemId = action.payload;

    if (initialBugBashItemId) {
        const { bugBashItemsLoaded } = yield race({
            bugBashItemsLoaded: take(BugBashItemsActionTypes.BugBashItemsLoaded),
            bugBashLoadFailed: take(BugBashesActionTypes.BugBashLoadFailed)
        });

        if (bugBashItemsLoaded) {
            yield put(BugBashViewActions.editBugBashItemRequested(initialBugBashItemId));
        }
    }
}

function* bugBashLoaded(action: ActionsOfType<BugBashesActions, BugBashesActionTypes.BugBashLoaded>) {
    const bugBash = action.payload;

    if (bugBash.autoAccept) {
        const viewMode: RT<typeof getBugBashViewMode> = yield select(getBugBashViewMode);
        if (viewMode !== BugBashViewMode.Accepted) {
            yield put(BugBashViewActions.setViewMode(BugBashViewMode.Accepted));
        }
    }
}

function* bugBashUpdated() {
    yield call(reloadPage);
}

function* setViewMode(action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.SetViewMode>): SagaIterator {
    const viewMode = action.payload;
    const [allBugBashItems, resolvedWorkItemsMap, teamsMap, filterState, sortState]: [
        RT<typeof getAllBugBashItems>,
        RT<typeof getResolvedWorkItemsMap>,
        RT<typeof getTeamsMap>,
        RT<typeof getBugBashItemsFilterState>,
        RT<typeof getBugBashItemsSortState>
    ] = yield all([
        select(getAllBugBashItems),
        select(getResolvedWorkItemsMap),
        select(getTeamsMap),
        select(getBugBashItemsFilterState),
        select(getBugBashItemsSortState)
    ]);
    yield call(refreshFilteredItems, allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);
}

function* applyFilter(action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.ApplyFilter>): SagaIterator {
    const filterState = action.payload;
    const [allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, sortState]: [
        RT<typeof getAllBugBashItems>,
        RT<typeof getResolvedWorkItemsMap>,
        RT<typeof getTeamsMap>,
        RT<typeof getBugBashViewMode>,
        RT<typeof getBugBashItemsSortState>
    ] = yield all([
        select(getAllBugBashItems),
        select(getResolvedWorkItemsMap),
        select(getTeamsMap),
        select(getBugBashViewMode),
        select(getBugBashItemsSortState)
    ]);
    yield call(refreshFilteredItems, allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);
}

function* applySort(action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.ApplySort>): SagaIterator {
    const sortState = action.payload;
    const [allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState]: [
        RT<typeof getAllBugBashItems>,
        RT<typeof getResolvedWorkItemsMap>,
        RT<typeof getTeamsMap>,
        RT<typeof getBugBashViewMode>,
        RT<typeof getBugBashItemsFilterState>
    ] = yield all([
        select(getAllBugBashItems),
        select(getResolvedWorkItemsMap),
        select(getTeamsMap),
        select(getBugBashViewMode),
        select(getBugBashItemsFilterState)
    ]);
    yield call(refreshFilteredItems, allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);
}

function* clearSortAndFilter(): SagaIterator {
    const [allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode]: [
        RT<typeof getAllBugBashItems>,
        RT<typeof getResolvedWorkItemsMap>,
        RT<typeof getTeamsMap>,
        RT<typeof getBugBashViewMode>
    ] = yield all([select(getAllBugBashItems), select(getResolvedWorkItemsMap), select(getTeamsMap), select(getBugBashViewMode)]);
    yield call(refreshFilteredItems, allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, undefined, undefined);
}

function* bugBashItemDeleteFailed(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemDeleteFailed>): SagaIterator {
    const { error } = action.payload;
    yield put(KeyValuePairActions.pushEntry(BugBashViewPageErrorKey, error));
}

function* bugBashItemsLoaded(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemsLoaded>): SagaIterator {
    const { bugBashItems, resolvedWorkItems } = action.payload;
    const [filterState, sortState, teamsMap, viewMode]: [
        RT<typeof getBugBashItemsFilterState>,
        RT<typeof getBugBashItemsSortState>,
        RT<typeof getTeamsMap>,
        RT<typeof getBugBashViewMode>
    ] = yield all([select(getBugBashItemsFilterState), select(getBugBashItemsSortState), select(getTeamsMap), select(getBugBashViewMode)]);
    yield call(refreshFilteredItems, bugBashItems, resolvedWorkItems, teamsMap, viewMode, filterState, sortState);

    const filterData = getBugBashItemsFilterData(bugBashItems, resolvedWorkItems);
    yield put(BugBashViewActions.setFilterData(filterData));
}

function* bugBashItemLoadedOrCreatedOrUpdatedOrDeleted(): SagaIterator {
    const [allBugBashItems, resolvedWorkItemsMap, filterState, sortState, teamsMap, viewMode]: [
        RT<typeof getAllBugBashItems>,
        RT<typeof getResolvedWorkItemsMap>,
        RT<typeof getBugBashItemsFilterState>,
        RT<typeof getBugBashItemsSortState>,
        RT<typeof getTeamsMap>,
        RT<typeof getBugBashViewMode>
    ] = yield all([
        select(getAllBugBashItems),
        select(getResolvedWorkItemsMap),
        select(getBugBashItemsFilterState),
        select(getBugBashItemsSortState),
        select(getTeamsMap),
        select(getBugBashViewMode)
    ]);

    yield call(refreshFilteredItems, allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);

    const filterData = getBugBashItemsFilterData(allBugBashItems, resolvedWorkItemsMap);
    yield put(BugBashViewActions.setFilterData(filterData));
}

function* editBugBashItemRequested(bugBashId: string, action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.EditBugBashItemRequested>) {
    const bugBashItemId = action.payload;
    const bugBashItem: RT<typeof getBugBashItem> = yield select(getBugBashItem, bugBashItemId);

    if (bugBashItem && isBugBashItemAccepted(bugBashItem)) {
        const workItem: RT<typeof openWorkItem> = yield call(openWorkItem, bugBashItem.workItemId!);
        yield put(BugBashItemsActions.bugBashItemUpdated(bugBashItem, workItem));
    } else {
        yield put(BugBashPortalActions.openBugBashItemPortal(bugBashId, bugBashItemId, { readFromCache: false }));
    }
}

function* onBugBashItemPortalDismissed(
    bugBashId: string,
    action: ActionsOfType<BugBashViewActions, BugBashViewActionTypes.DismissBugBashItemPortalRequested>
) {
    const { bugBashItemId, workItemId } = action.payload;
    if (workItemId) {
        const workItemUrl: RT<typeof getWorkItemUrlAsync> = yield call(getWorkItemUrlAsync, workItemId);
        yield call(addToast, {
            message: Resources.BugBashAcceptedCreatedMessage,
            callToAction: Resources.View,
            duration: 5000,
            forceOverrideExisting: true,
            onCallToActionClick: () => {
                openNewWindow(workItemUrl);
            }
        });
        yield put(BugBashPortalActions.dismissPortal());
    } else {
        const callbackChannel: Channel<BugBashPortalActions> = yield call(channel);
        const callback = () => {
            callbackChannel.put(BugBashPortalActions.openBugBashItemPortal(bugBashId, bugBashItemId, { readFromCache: true }));
        };

        yield call(addToast, {
            message: Resources.BugBashItemCreatedMessage,
            callToAction: Resources.View,
            duration: 5000,
            forceOverrideExisting: true,
            onCallToActionClick: callback
        });
        yield put(BugBashPortalActions.dismissPortal());

        const { message } = yield race({
            message: take(callbackChannel),
            timeout: delay(5000)
        });

        if (message) {
            yield put(message);
        }
        yield call([callbackChannel, callbackChannel.close]);
    }
}

function* refreshFilteredItems(
    allBugBashItems: IBugBashItem[] | undefined,
    resolvedWorkItemsMap: { [id: number]: WorkItem } | undefined,
    teamsMap: { [idOrName: string]: WebApiTeam } | undefined,
    viewMode: BugBashViewMode,
    filterState: IFilterState | undefined,
    sortState: ISortState | undefined
): SagaIterator {
    const filteredBugBashItems = getFilteredBugBashItems(allBugBashItems, resolvedWorkItemsMap, teamsMap, viewMode, filterState, sortState);
    yield put(BugBashViewActions.setFilteredItems(filteredBugBashItems));
}
