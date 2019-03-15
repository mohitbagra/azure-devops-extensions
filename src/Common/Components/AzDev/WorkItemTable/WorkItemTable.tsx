import { IdentityRef } from "azure-devops-extension-api/WebApi";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import { WorkItemStateView } from "Common/Components/AzDev/WorkItemStateView";
import { WorkItemTitleView } from "Common/Components/AzDev/WorkItemTitleView";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { IdentityView } from "Common/Components/IdentityView";
import { Loading } from "Common/Components/Loading";
import { ITableColumn, Table } from "Common/Components/Table";
import { CoreFieldRefNames } from "Common/Constants";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    areWorkItemsLoaded, getWorkItemModule, getWorkItems, IWorkItemAwareState, WorkItemActions
} from "Common/Redux/WorkItems";
import * as React from "react";

interface IWorkItemTableOwnProps {
    ids: number[];
}

interface IWorkItemTableStateProps {
    workItems?: WorkItem[];
    loading: boolean;
}

const Actions = {
    loadWorkItems: WorkItemActions.loadRequested
};

const columns: ITableColumn<WorkItem>[] = [
    {
        id: "title",
        name: "Title",
        minWidth: 200,
        maxWidth: 800,
        width: 500,
        resizable: true,
        renderCell: renderTitleCell
    },
    { id: "state", name: "State", minWidth: 80, maxWidth: 300, width: 200, resizable: false, renderCell: renderStateCell },
    {
        id: "assignedTo",
        name: "Assigned To",
        minWidth: 80,
        maxWidth: 300,
        width: 200,
        resizable: true,
        renderCell: renderAssignedToCell
    }
];

function renderTitleCell(_rowIndex: number, _columnIndex: number, _tableColumn: ITableColumn<WorkItem>, workItem: WorkItem): JSX.Element {
    return (
        <WorkItemTitleView
            workItemId={workItem.id}
            title={workItem.fields[CoreFieldRefNames.Title] as string}
            workItemTypeName={workItem.fields[CoreFieldRefNames.WorkItemType] as string}
            showId={true}
        />
    );
}

function renderStateCell(_rowIndex: number, _columnIndex: number, _tableColumn: ITableColumn<WorkItem>, workItem: WorkItem): JSX.Element {
    return (
        <WorkItemStateView
            stateName={workItem.fields[CoreFieldRefNames.State] as string}
            workItemTypeName={workItem.fields[CoreFieldRefNames.WorkItemType] as string}
        />
    );
}

function renderAssignedToCell(_rowIndex: number, _columnIndex: number, _tableColumn: ITableColumn<WorkItem>, workItem: WorkItem): JSX.Element {
    return <IdentityView value={workItem.fields[CoreFieldRefNames.AssignedTo] as IdentityRef} />;
}

function WorkItemTableInternal(props: IWorkItemTableOwnProps) {
    const { ids } = props;
    const mapStateToProps = React.useCallback(
        (state: IWorkItemAwareState): IWorkItemTableStateProps => {
            return {
                workItems: getWorkItems(state, ids),
                loading: !areWorkItemsLoaded(state, ids)
            };
        },
        [ids]
    );
    const { workItems, loading } = useMappedState(mapStateToProps);
    const { loadWorkItems } = useActionCreators(Actions);

    React.useEffect(() => {
        loadWorkItems(ids);
    }, [ids]);

    if (loading || !workItems) {
        return <Loading />;
    }

    return <Table<WorkItem> columns={columns} items={workItems} />;
}

export function WorkItemTable(props: IWorkItemTableOwnProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemModule()]}>
            <WorkItemTableInternal {...props} />
        </DynamicModuleLoader>
    );
}
