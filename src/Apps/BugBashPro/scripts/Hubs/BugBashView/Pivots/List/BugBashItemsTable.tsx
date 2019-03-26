import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IMenuItem } from "azure-devops-ui/Components/Menu/Menu.Props";
import { ColumnMore, ITableColumn as VSSUI_ITableColumn, SortOrder } from "azure-devops-ui/Table";
import { BugBashItemFieldNames, WorkItemFieldNames } from "BugBashPro/Hubs/BugBashView/Constants";
import { useBugBashItemsSort } from "BugBashPro/Hubs/BugBashView/Hooks/useBugBashItemsSort";
import { useBugBashViewMode } from "BugBashPro/Hubs/BugBashView/Hooks/useBugBashViewMode";
import { IBugBashItemProviderParams, IBugBashViewBaseProps } from "BugBashPro/Hubs/BugBashView/Interfaces";
import { BugBashViewMode } from "BugBashPro/Hubs/BugBashView/Redux";
import { BugBashItemEditorPortalActions } from "BugBashPro/Portals/BugBashItemEditorPortal/Redux";
import { Resources } from "BugBashPro/Resources";
import { IBugBash, IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems";
import { ITableColumn, Table } from "Common/Components/Table";
import { ColumnSorting } from "Common/Components/Table/ColumnSorting";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";
import * as React from "react";
import { onRenderBugBashItemCell } from "./BugBashItemCellRenderers";

const Actions = {
    openEditorPanel: BugBashItemEditorPortalActions.openPortal,
    deleteBugBashItem: BugBashItemsActions.bugBashItemDeleteRequested
};

export function BugBashItemsTable(props: IBugBashViewBaseProps & IBugBashItemProviderParams) {
    const { bugBash, filteredBugBashItems, workItemsMap } = props;
    const { openEditorPanel, deleteBugBashItem } = useActionCreators(Actions);
    const { viewMode } = useBugBashViewMode();
    const { applySort, sortColumn, isSortedDescending } = useBugBashItemsSort();

    const sortingBehavior = React.useMemo(
        () =>
            new ColumnSorting<IBugBashItem>((proposedColumn: VSSUI_ITableColumn<IBugBashItem>, proposedSortOrder: SortOrder) => {
                if (proposedColumn.id === BugBashItemFieldNames.Status) {
                    return;
                }

                applySort({
                    sortKey: proposedColumn.id,
                    isSortedDescending: proposedSortOrder === SortOrder.descending
                });
            }),
        [viewMode]
    );

    const columns = React.useMemo(
        () => getColumns(bugBash, viewMode, workItemsMap, sortColumn, isSortedDescending, openEditorPanel, deleteBugBashItem),
        [bugBash, viewMode, workItemsMap, sortColumn, isSortedDescending]
    );

    return (
        <Table<IBugBashItem>
            key={viewMode}
            columns={columns}
            items={filteredBugBashItems}
            scrollable={true}
            showLines={false}
            behaviors={[sortingBehavior]}
        />
    );
}

export function getColumns(
    bugBash: IBugBash,
    viewMode: BugBashViewMode,
    workItemsMap: { [workItemId: number]: WorkItem } | undefined,
    sortColumn: string | undefined,
    isSortedDescending: boolean | undefined,
    onEdit: (bugBash: IBugBash, bugBashItem: IBugBashItem) => void,
    onDelete: (bugBashId: string, bugBashItemId: string) => void
): ITableColumn<IBugBashItem>[] {
    let columns: ITableColumn<IBugBashItem>[];
    switch (viewMode) {
        case BugBashViewMode.Accepted: {
            columns = getAcceptedColumns();
            break;
        }

        case BugBashViewMode.Pending: {
            columns = getPendingColumns();
            break;
        }

        case BugBashViewMode.Rejected: {
            columns = getRejectedColumns();
            break;
        }

        default: {
            columns = getAllColumns();
        }
    }

    columns[columns.length - 1].resizable = false; // last column always non resizable
    for (const column of columns) {
        if (column.id === sortColumn) {
            column.isSorted = true;
            column.isSortedDescending = isSortedDescending;
        }
        column.renderCell = (_rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IBugBashItem>, bugBashItem: IBugBashItem) => {
            return onRenderBugBashItemCell(
                columnIndex,
                tableColumn,
                column.id as BugBashItemFieldNames | WorkItemFieldNames,
                bugBashItem,
                bugBashItem.workItemId && workItemsMap ? workItemsMap[bugBashItem.workItemId] : undefined,
                (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
                    if (!e.ctrlKey) {
                        e.preventDefault();
                        onEdit(bugBash, bugBashItem);
                    }
                }
            );
        };
    }

    columns.push(getContextMenuItems(bugBash, onEdit, onDelete));
    return columns;
}

function getContextMenuItems(
    bugBash: IBugBash,
    onEdit: (bugBash: IBugBash, bugBashItem: IBugBashItem) => void,
    onDelete: (bugBashId: string, bugBashItemId: string) => void
): ColumnMore<IBugBashItem> {
    return new ColumnMore((bugBashItem: IBugBashItem) => {
        const menuItems: IMenuItem[] = [
            {
                id: "edit",
                text: Resources.Edit,
                onActivate: () => {
                    onEdit(bugBash, bugBashItem);
                },
                iconProps: { iconName: "Edit", className: "communication-foreground" }
            }
        ];
        if (!isBugBashItemAccepted(bugBashItem)) {
            menuItems.push({
                id: "delete",
                text: Resources.Delete,
                onActivate: () => {
                    confirmAction(Resources.ConfirmDialogTitle, Resources.DeleteBugBashItemConfirmation, (ok: boolean) => {
                        if (ok) {
                            onDelete(bugBashItem.bugBashId, bugBashItem.id!);
                        }
                    });
                },
                iconProps: { iconName: "Cancel", className: "error-text" }
            });
        }
        return {
            id: "sub-menu",
            items: menuItems
        };
    });
}

function getAllColumns(): ITableColumn<IBugBashItem>[] {
    return [
        getColumn(BugBashItemFieldNames.Status, "", [40, 40, 40]),
        getColumn(BugBashItemFieldNames.Title, "Title", [-50, 300, 1500]),
        getColumn(BugBashItemFieldNames.CreatedBy, "Created By", [-25, 150, 500]),
        getColumn(BugBashItemFieldNames.CreatedDate, "Created Date", [-25, 150, 500])
    ];
}

function getAcceptedColumns(): ITableColumn<IBugBashItem>[] {
    return [
        getColumn(BugBashItemFieldNames.Title, "Title", [-30, 200, 800]),
        getColumn(WorkItemFieldNames.State, "State", [-10, 100, 200]),
        getColumn(WorkItemFieldNames.AssignedTo, "Assigned To", [-15, 100, 300]),
        getColumn(WorkItemFieldNames.AreaPath, "Area Path", [-15, 150, 250]),
        getColumn(BugBashItemFieldNames.CreatedBy, "Item Created By", [-15, 100, 300]),
        getColumn(BugBashItemFieldNames.CreatedDate, "Item Created Date", [-15, 100, 300])
    ];
}

function getRejectedColumns(): ITableColumn<IBugBashItem>[] {
    return [
        getColumn(BugBashItemFieldNames.Title, "Title", [-30, 200, 800]),
        getColumn(BugBashItemFieldNames.TeamId, "Assigned to team", [-14, 150, 300]),
        getColumn(BugBashItemFieldNames.CreatedBy, "Created By", [-14, 100, 300]),
        getColumn(BugBashItemFieldNames.CreatedDate, "Created Date", [-14, 100, 300]),
        getColumn(BugBashItemFieldNames.RejectedBy, "Rejected By", [-14, 100, 300]),
        getColumn(BugBashItemFieldNames.RejectReason, "Reject Reason", [-14, 100, 300])
    ];
}

function getPendingColumns(): ITableColumn<IBugBashItem>[] {
    return [
        getColumn(BugBashItemFieldNames.Title, "Title", [-40, 300, 1500]),
        getColumn(BugBashItemFieldNames.TeamId, "Assigned to team", [-20, 150, 500]),
        getColumn(BugBashItemFieldNames.CreatedBy, "Created By", [-20, 150, 500]),
        getColumn(BugBashItemFieldNames.CreatedDate, "Created Date", [-20, 150, 500])
    ];
}

function getColumn(key: BugBashItemFieldNames | WorkItemFieldNames, name: string, widths: [number, number, number]): ITableColumn<IBugBashItem> {
    const [width, minWidth, maxWidth] = widths;
    return {
        id: key,
        name: name,
        minWidth: minWidth,
        maxWidth: maxWidth,
        width: width,
        resizable: key !== BugBashItemFieldNames.Status
    } as ITableColumn<IBugBashItem>;
}
