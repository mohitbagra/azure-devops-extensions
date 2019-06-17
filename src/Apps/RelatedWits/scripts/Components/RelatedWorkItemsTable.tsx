import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ColumnMore, ITableColumn as VSSUI_ITableColumn, SortOrder } from "azure-devops-ui/Table";
import { ITableColumn, Table } from "Common/Components/Table";
import { ColumnSorting } from "Common/Components/Table/ColumnSorting";
import { CoreFieldRefNames } from "Common/Constants";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { RelatedWorkItemActions } from "../Redux/Actions";
import { IRelatedWitsAwareState } from "../Redux/Contracts";
import { getSortColumn, isSortedDescending } from "../Redux/Selectors";
import { onRenderWorkItemCell } from "./CellRenderers";

interface IRelatedWorkItemsTableProps {
    workItems: WorkItem[];
}

const Actions = {
    applySort: RelatedWorkItemActions.applySort
};

const mapState = (state: IRelatedWitsAwareState) => {
    return {
        sortColumn: getSortColumn(state),
        isSortedDescending: isSortedDescending(state)
    };
};

export function RelatedWorkItemsTable(props: IRelatedWorkItemsTableProps) {
    const { workItems } = props;
    const { sortColumn, isSortedDescending } = useMappedState(mapState);
    const { applySort } = useActionCreators(Actions);

    const columns = React.useMemo(() => getColumns(sortColumn, isSortedDescending), [sortColumn, isSortedDescending]);
    const sortingBehavior = React.useMemo(
        () =>
            new ColumnSorting<WorkItem>((proposedColumn: VSSUI_ITableColumn<WorkItem>, proposedSortOrder: SortOrder) => {
                applySort({
                    sortKey: proposedColumn.id,
                    isSortedDescending: proposedSortOrder === SortOrder.descending
                });
            }),
        []
    );

    return (
        <Table<WorkItem>
            columns={columns}
            items={workItems}
            scrollable={true}
            showLines={false}
            singleClickActivation={false}
            behaviors={[sortingBehavior]}
        />
    );
}

function getColumns(sortColumn: string | undefined, isSortedDescending: boolean): ITableColumn<WorkItem>[] {
    return [
        getColumn(CoreFieldRefNames.Id, "ID", { min: 80, max: 80, width: 80 }, sortColumn, isSortedDescending),
        getColumn(CoreFieldRefNames.Title, "Title", { min: 300, max: 1500, width: -40 }, sortColumn, isSortedDescending),
        getColumn(CoreFieldRefNames.State, "State", { min: 150, max: 500, width: -20 }, sortColumn, isSortedDescending),
        getColumn(CoreFieldRefNames.AssignedTo, "Assigned to", { min: 150, max: 500, width: -20 }, sortColumn, isSortedDescending),
        getColumn(CoreFieldRefNames.AreaPath, "Area Path", { min: 150, max: 500, width: -20 }, sortColumn, isSortedDescending),
        new ColumnMore((_workItem: WorkItem) => {
            return {
                id: "sub-menu",
                items: [
                    {
                        id: "open",
                        text: "Open selected items",
                        iconProps: { iconName: "ReplyMirrored", className: "communication-foreground" }
                    }
                ]
            };
        })
    ];
}

function getColumn(
    key: string,
    name: string,
    widths: { width: number; min: number; max: number },
    sortColumn: string | undefined,
    isSortedDescending: boolean
) {
    return {
        id: key,
        name: name,
        minWidth: widths.min,
        maxWidth: widths.max,
        width: widths.width,
        readonly: true,
        resizable: true,
        isSorted: sortColumn === key,
        isSortedDescending: isSortedDescending,
        renderCell: (_: unknown, columnIndex: number, tableColumn: ITableColumn<WorkItem>, workItem: WorkItem) => {
            return onRenderWorkItemCell(columnIndex, tableColumn, key, workItem);
        }
    };
}
