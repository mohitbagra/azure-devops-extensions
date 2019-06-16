import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ColumnMore, ITableColumn as VSSUI_ITableColumn, SimpleTableCell, SortOrder } from "azure-devops-ui/Table";
import { ITableColumn, Table } from "Common/Components/Table";
import { ColumnSorting } from "Common/Components/Table/ColumnSorting";
import { CoreFieldRefNames } from "Common/Constants";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { RelatedWorkItemActions } from "../Redux/Actions";
import { IRelatedWitsAwareState } from "../Redux/Contracts";
import { getSortColumn, isSortedDescending } from "../Redux/Selectors";

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

function getColumns(sortColumn: string | undefined, isSortedDescending: boolean | undefined): ITableColumn<WorkItem>[] {
    return [
        {
            id: CoreFieldRefNames.Title,
            name: "Title",
            minWidth: 300,
            maxWidth: 1500,
            width: -50,
            isSorted: sortColumn === CoreFieldRefNames.Title,
            isSortedDescending: isSortedDescending,
            renderCell: (_: unknown, columnIndex: number, tableColumn: ITableColumn<WorkItem>, workItem: WorkItem) => {
                return (
                    <SimpleTableCell
                        contentClassName="bolt-table-cell-content-with-link"
                        columnIndex={columnIndex}
                        tableColumn={tableColumn}
                        key={`col-${columnIndex}`}
                    >
                        {workItem.fields[CoreFieldRefNames.Title]}
                    </SimpleTableCell>
                );
            }
        },
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
