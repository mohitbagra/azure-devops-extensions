import { TeamFieldValues } from "azure-devops-extension-api/Work/Work";
import { WorkItem, WorkItemTemplate } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { equals } from "azure-devops-ui/Core/Util/String";
import { IBugBash, IBugBashItem } from "BugBashPro/Shared/Contracts";
import { TeamFieldActions, TeamFieldActionTypes } from "Common/AzDev/TeamFields/Redux/Actions";
import { ITeamFieldValues } from "Common/AzDev/TeamFields/Redux/Contracts";
import { getTeamFieldValues } from "Common/AzDev/TeamFields/Redux/Selectors";
import { WorkItemTemplateActions, WorkItemTemplateActionTypes } from "Common/AzDev/WorkItemTemplates/Redux/Actions";
import { IWorkItemTemplate } from "Common/AzDev/WorkItemTemplates/Redux/Contracts";
import { getTemplateState } from "Common/AzDev/WorkItemTemplates/Redux/Selectors";
import { CoreFieldRefNames } from "Common/Constants";
import { LoadStatus } from "Common/Contracts";
import { ActionsOfType } from "Common/Redux";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { SagaIterator } from "redux-saga";
import { call, put, select, take, takeEvery } from "redux-saga/effects";
import { BugBashItemsActions, BugBashItemsActionTypes } from "./Actions";
import {
    createBugBashItemAsync,
    createWorkItemAsync,
    deleteBugBashItemAsync,
    fetchBugBashItemAsync,
    fetchBugBashItemsAsync,
    getWorkItemsAsync,
    updateBugBashItemAsync
} from "./DataSource";
import { getBugBashItemsStatus, getBugBashItemStatus, getResolvedWorkItem } from "./Selectors";

export function* bugBashItemsSaga(): SagaIterator {
    yield takeEvery(BugBashItemsActionTypes.BugBashItemsLoadRequested, loadBugBashItems);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemLoadRequested, loadBugBashItem);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemCreateRequested, createBugBashItem);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemUpdateRequested, updateBugBashItem);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemDeleteRequested, deleteBugBashItem);
    yield takeEvery(BugBashItemsActionTypes.BugBashItemAcceptRequested, acceptBugBashItem);
}

function* loadBugBashItems(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemsLoadRequested>): SagaIterator {
    const bugBashId = action.payload;
    const status: LoadStatus = yield select(getBugBashItemsStatus);

    if (status !== LoadStatus.Loading) {
        yield put(BugBashItemsActions.beginLoadBugBashItems());
        let bugBashItems: IBugBashItem[] = yield call(fetchBugBashItemsAsync, bugBashId);

        const workItemIdsToLoad: number[] = [];
        for (const bugBashItem of bugBashItems) {
            if (bugBashItem.workItemId) {
                workItemIdsToLoad.push(bugBashItem.workItemId);
            }
        }
        const resolvedWorkItems: WorkItem[] = yield call(getWorkItemsAsync, workItemIdsToLoad);
        const workItemsMap: { [id: number]: WorkItem } = {};
        resolvedWorkItems.forEach(w => {
            workItemsMap[w.id] = w;
        });
        bugBashItems = bugBashItems.filter(b => !b.workItemId || (b.workItemId && workItemsMap[b.workItemId] !== undefined));

        yield put(BugBashItemsActions.bugBashItemsLoaded(bugBashItems, workItemsMap));
    }
}

function* loadBugBashItem(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemLoadRequested>): SagaIterator {
    const { bugBashId, bugBashItemId } = action.payload;
    const status: LoadStatus = yield select(getBugBashItemStatus, bugBashItemId);

    if (status !== LoadStatus.Loading && status !== LoadStatus.Updating) {
        yield put(BugBashItemsActions.beginLoadBugBashItem(bugBashItemId));
        try {
            const data: IBugBashItem = yield call(fetchBugBashItemAsync, bugBashId, bugBashItemId);

            // try to load resolved work item
            if (data.workItemId) {
                const cachedWorkItem: WorkItem = yield select(getResolvedWorkItem, data.workItemId);
                if (!cachedWorkItem) {
                    // if work item is not already loaded, try to load it.
                    const resolvedWorkItems: WorkItem[] = yield call(getWorkItemsAsync, [data.workItemId]);
                    if (resolvedWorkItems && resolvedWorkItems.length === 1) {
                        yield put(BugBashItemsActions.bugBashItemLoaded(data, resolvedWorkItems[0]));
                    } else {
                        // work item does not exist, fire load failed
                        yield put(
                            BugBashItemsActions.bugBashItemLoadFailed(
                                bugBashItemId,
                                "The work item associated either doesnt exist or you dont have permission to view it."
                            )
                        );
                    }
                } else {
                    // dont add the cached work item again in store
                    yield put(BugBashItemsActions.bugBashItemLoaded(data, undefined));
                }
            } else {
                yield put(BugBashItemsActions.bugBashItemLoaded(data, undefined));
            }
        } catch (e) {
            yield put(BugBashItemsActions.bugBashItemLoadFailed(bugBashItemId, e.message));
        }
    }
}

function* createBugBashItem(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemCreateRequested>): SagaIterator {
    const bugBashItem = action.payload;

    if (isNullOrWhiteSpace(bugBashItem.bugBashId)) {
        throw new Error("This bug bash item is not associated with any bug bash");
    }

    yield put(BugBashItemsActions.beginCreateBugBashItem(bugBashItem));
    try {
        const createdBugBashItem: IBugBashItem = yield call(createBugBashItemAsync, bugBashItem.bugBashId, bugBashItem);
        yield put(BugBashItemsActions.bugBashItemCreated(createdBugBashItem, undefined));
    } catch (e) {
        yield put(BugBashItemsActions.bugBashItemCreateFailed(bugBashItem, e.message));
    }
}

function* updateBugBashItem(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemUpdateRequested>): SagaIterator {
    const bugBashItem = action.payload;

    if (isNullOrWhiteSpace(bugBashItem.bugBashId)) {
        throw new Error("This bug bash item is not associated with any bug bash");
    }

    const status: LoadStatus = yield select(getBugBashItemStatus, bugBashItem.id!);

    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed) {
        yield put(BugBashItemsActions.beginUpdateBugBashItem(bugBashItem));
        try {
            const updatedBugBashItem: IBugBashItem = yield call(updateBugBashItemAsync, bugBashItem.bugBashId, bugBashItem);
            yield put(BugBashItemsActions.bugBashItemUpdated(updatedBugBashItem, undefined));
        } catch (e) {
            yield put(BugBashItemsActions.bugBashItemUpdateFailed(bugBashItem, e.message));
        }
    }
}

function* deleteBugBashItem(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemDeleteRequested>): SagaIterator {
    const { bugBashId, bugBashItemId } = action.payload;

    const status: LoadStatus = yield select(getBugBashItemStatus, bugBashItemId);

    if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed || status === LoadStatus.LoadFailed) {
        yield put(BugBashItemsActions.beginDeleteBugBashItem(bugBashItemId));
        try {
            yield call(deleteBugBashItemAsync, bugBashId, bugBashItemId);
            yield put(BugBashItemsActions.bugBashItemDeleted(bugBashItemId));
        } catch (e) {
            yield put(BugBashItemsActions.bugBashItemDeleteFailed(bugBashItemId, e.message));
        }
    }
}

function* acceptBugBashItem(action: ActionsOfType<BugBashItemsActions, BugBashItemsActionTypes.BugBashItemAcceptRequested>): SagaIterator {
    const { bugBashItem, bugBash, acceptingDuringCreation } = action.payload;

    if (isNullOrWhiteSpace(bugBashItem.bugBashId)) {
        throw new Error("This bug bash item is not associated with any bug bash");
    }

    if (bugBashItem.id && !bugBashItem.workItemId) {
        const status: LoadStatus = yield select(getBugBashItemStatus, bugBashItem.id);

        if (status === LoadStatus.Ready || status === LoadStatus.UpdateFailed) {
            yield put(BugBashItemsActions.beginUpdateBugBashItem(bugBashItem));

            let updatedBugBashItem: IBugBashItem = { ...bugBashItem };
            try {
                // read bug bash wit template
                const acceptTemplateId = bugBash.acceptTemplateId;
                const acceptTemplateTeam = bugBash.acceptTemplateTeam;
                let acceptTemplate: WorkItemTemplate | undefined;

                // load template
                if (acceptTemplateId && acceptTemplateTeam) {
                    acceptTemplate = yield call(loadTemplate, acceptTemplateId, acceptTemplateTeam);
                }

                // load team field
                const teamFieldValue: TeamFieldValues = yield call(loadTeamFieldValues, bugBashItem.teamId);

                // fill in field values
                const fieldValues = getAcceptFieldValues(bugBash, bugBashItem, acceptTemplate, teamFieldValue);

                if (!acceptingDuringCreation) {
                    // do an empty update first to make sure we are on the latest revision.
                    updatedBugBashItem = yield call(updateBugBashItemAsync, bugBashItem.bugBashId, bugBashItem);
                }

                // attempt to save work item
                const acceptedWorkItem = yield call(createWorkItemAsync, bugBash.workItemType, fieldValues);

                // update bug bash item again with work item id
                updatedBugBashItem = yield call(updateBugBashItemAsync, bugBashItem.bugBashId, {
                    ...updatedBugBashItem,
                    title: "",
                    description: "",
                    teamId: "",
                    rejectReason: "",
                    rejected: false,
                    rejectedBy: undefined,
                    workItemId: acceptedWorkItem.id
                });

                yield put(BugBashItemsActions.bugBashItemUpdated(updatedBugBashItem, acceptedWorkItem));
            } catch (e) {
                yield put(BugBashItemsActions.bugBashItemUpdateFailed(updatedBugBashItem, e.message));
            }
        }
    }
}

function* loadTemplate(templateId: string, teamId: string) {
    const template: IWorkItemTemplate | undefined = yield select(getTemplateState, templateId);

    if (template && template.status === LoadStatus.Ready && !template.error) {
        return yield template.template;
    } else if (template && template.error) {
        throw new Error(template.error);
    } else {
        yield put(WorkItemTemplateActions.loadRequested(teamId, templateId));

        const templateAction: ActionsOfType<
            WorkItemTemplateActions,
            WorkItemTemplateActionTypes.LoadSucceeded | WorkItemTemplateActionTypes.LoadFailed
        > = yield take(
            (
                action: ActionsOfType<WorkItemTemplateActions, WorkItemTemplateActionTypes.LoadSucceeded | WorkItemTemplateActionTypes.LoadFailed>
            ): boolean => {
                if (action.type === WorkItemTemplateActionTypes.LoadSucceeded && equals(action.payload.id, templateId, true)) {
                    return true;
                } else if (action.type === WorkItemTemplateActionTypes.LoadFailed && equals(action.payload.templateId, templateId, true)) {
                    return true;
                } else {
                    return false;
                }
            }
        );

        if (templateAction.type === WorkItemTemplateActionTypes.LoadSucceeded) {
            return yield templateAction.payload;
        } else {
            const error = templateAction.payload.error;
            throw new Error(error);
        }
    }
}

function* loadTeamFieldValues(teamId: string) {
    const teamFieldValues: ITeamFieldValues | undefined = yield select(getTeamFieldValues, teamId);

    if (teamFieldValues && teamFieldValues.status === LoadStatus.Ready && !teamFieldValues.error) {
        return yield teamFieldValues;
    } else if (teamFieldValues && teamFieldValues.error) {
        throw new Error(teamFieldValues.error);
    } else {
        yield put(TeamFieldActions.loadRequested(teamId));

        const teamFieldAction: ActionsOfType<TeamFieldActions, TeamFieldActionTypes.LoadSucceeded | TeamFieldActionTypes.LoadFailed> = yield take(
            (action: ActionsOfType<TeamFieldActions, TeamFieldActionTypes.LoadSucceeded | TeamFieldActionTypes.LoadFailed>): boolean => {
                if (action.type === TeamFieldActionTypes.LoadSucceeded && equals(action.payload.teamId, teamId, true)) {
                    return true;
                } else if (action.type === TeamFieldActionTypes.LoadFailed && equals(action.payload.teamId, teamId, true)) {
                    return true;
                } else {
                    return false;
                }
            }
        );

        if (teamFieldAction.type === TeamFieldActionTypes.LoadSucceeded) {
            return yield teamFieldAction.payload.teamFieldValues;
        } else {
            const error = teamFieldAction.payload.error;
            throw new Error(error);
        }
    }
}

function getAcceptFieldValues(
    bugBash: IBugBash,
    bugBashItem: IBugBashItem,
    acceptTemplate: WorkItemTemplate | undefined,
    teamFieldValue: TeamFieldValues
): { [refName: string]: any } {
    const itemDescriptionField = bugBash.itemDescriptionField;
    const fieldValues = acceptTemplate ? { ...acceptTemplate.fields } : {};
    fieldValues[CoreFieldRefNames.Title] = bugBashItem.title;
    fieldValues[itemDescriptionField] = bugBashItem.description || "";

    if (teamFieldValue.defaultValue) {
        fieldValues[teamFieldValue.field.referenceName] = teamFieldValue.defaultValue;
    }

    if (fieldValues["System.Tags-Add"]) {
        fieldValues["System.Tags"] = fieldValues["System.Tags-Add"];
    }

    delete fieldValues["System.Tags-Add"];
    delete fieldValues["System.Tags-Remove"];

    return fieldValues;
}
