import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { IMenuItem } from "azure-devops-ui/Components/Menu/Menu.Props";
import { ListSelection } from "azure-devops-ui/List";
import { ColumnMore, ColumnSelect, ITableColumn as VSSUI_ITableColumn, ITableRow, SortOrder } from "azure-devops-ui/Table";
import { BugBashViewActions } from "BugBashPro/Hubs/BugBashView//Redux/Actions";
import { BugBashViewMode } from "BugBashPro/Hubs/BugBashView//Redux/Contracts";
import { BugBashItemFieldNames, WorkItemFieldNames } from "BugBashPro/Hubs/BugBashView/Constants";
import { useBugBashItemsSort } from "BugBashPro/Hubs/BugBashView/Hooks/useBugBashItemsSort";
import { useBugBashViewMode } from "BugBashPro/Hubs/BugBashView/Hooks/useBugBashViewMode";
import { IBugBashItemProviderParams } from "BugBashPro/Hubs/BugBashView/Interfaces";
import { Resources } from "BugBashPro/Resources";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
import { ITableColumn, Table } from "Common/Components/Table";
import { ColumnSorting } from "Common/Components/Table/ColumnSorting";
import { CoreFieldRefNames } from "Common/Constants";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { openNewWindow } from "Common/ServiceWrappers/HostNavigationService";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";
import { getQueryUrlAsync } from "Common/Utilities/UrlHelper";
import * as React from "react";
import { onRenderBugBashItemCell } from "./BugBashItemCellRenderers";

const Actions = {
    editBugBashItemRequested: BugBashViewActions.editBugBashItemRequested,
    deleteBugBashItem: BugBashItemsActions.bugBashItemDeleteRequested
};

export function BugBashItemsTable(props: IBugBashItemProviderParams) {
    const { filteredBugBashItems, workItemsMap } = props;

    const { editBugBashItemRequested, deleteBugBashItem } = useActionCreators(Actions);
    const { viewMode } = useBugBashViewMode();
    const { applySort, sortColumn, isSortedDescending } = useBugBashItemsSort();
    const selectionRef = React.useRef(new ListSelection(true));
    const columnSelect = React.useMemo(() => new ColumnSelect(), [viewMode]);
    const onEditBugBashItem = React.useCallback((bugBashItemId: string) => {
        editBugBashItemRequested(bugBashItemId);
    }, []);

    const columnMore = React.useMemo(
        () =>
            getContextMenuItems(
                filteredBugBashItems,
                viewMode === BugBashViewMode.Accepted ? selectionRef.current : undefined,
                onEditBugBashItem,
                deleteBugBashItem
            ),
        [filteredBugBashItems, viewMode]
    );

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

    const columns = React.useMemo(() => {
        const columns = getColumns(viewMode, workItemsMap, sortColumn, isSortedDescending, onEditBugBashItem);
        if (viewMode === BugBashViewMode.Accepted) {
            columns.unshift(columnSelect);
        }
        columns.push(columnMore);
        return columns;
    }, [viewMode, workItemsMap, sortColumn, isSortedDescending]);

    const onRowActivate = React.useCallback((_event: React.SyntheticEvent<HTMLElement>, tableRow: ITableRow<IBugBashItem>) => {
        onEditBugBashItem(tableRow.data.id!);
    }, []);

    return (
        <Table<IBugBashItem>
            key={viewMode}
            columns={columns}
            items={filteredBugBashItems}
            scrollable={true}
            showLines={false}
            behaviors={[sortingBehavior]}
            singleClickActivation={viewMode === BugBashViewMode.Accepted ? false : true}
            onActivate={onRowActivate}
            selection={viewMode === BugBashViewMode.Accepted ? selectionRef.current : undefined}
        />
    );
}

export function getColumns(
    viewMode: BugBashViewMode,
    workItemsMap: { [workItemId: number]: WorkItem } | undefined,
    sortColumn: string | undefined,
    isSortedDescending: boolean | undefined,
    onEditBugBashItem: (bugBashItemId: string) => void
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
                        onEditBugBashItem(bugBashItem.id!);
                    }
                }
            );
        };
    }

    return columns;
}

function getContextMenuItems(
    bugBashItems: IBugBashItem[],
    selection: ListSelection | undefined,
    onEditBugBashItem: (bugBashItemId: string) => void,
    onDeleteBugBashItem: (bugBashId: string, bugBashItemId: string) => void
): ColumnMore<IBugBashItem> {
    return new ColumnMore((bugBashItem: IBugBashItem) => {
        const menuItems: IMenuItem[] = [];
        if (!selection || selection.selectedCount === 1) {
            // if there is no selection (non-accepted view mode), or if only 1 row is selected in accepted view mode, show Edit menu item
            menuItems.push({
                id: "edit",
                text: Resources.Edit,
                onActivate: () => {
                    onEditBugBashItem(bugBashItem.id!);
                },
                iconProps: { iconName: "Edit", className: "communication-foreground" }
            });
        } else if (selection && selection.selectedCount > 1) {
            // only for accepted work items
            menuItems.push({
                id: "openInQueries",
                text: Resources.OpenSelectedWorkItems,
                onActivate: () => {
                    const selectedWorkItemIds: number[] = [];
                    const ranges = selection.value;
                    for (const range of ranges) {
                        const { endIndex, beginIndex } = range;
                        selectedWorkItemIds.push(...bugBashItems.slice(beginIndex, endIndex + 1).map(b => b.workItemId!));
                    }
                    navigateToQueries(selectedWorkItemIds);
                },
                iconProps: { iconName: "ReplyMirrored", className: "communication-foreground" }
            });
        }

        if (!isBugBashItemAccepted(bugBashItem)) {
            menuItems.push({
                id: "delete",
                text: Resources.Delete,
                onActivate: () => {
                    confirmAction(Resources.ConfirmDialogTitle, Resources.DeleteBugBashItemConfirmation, (ok: boolean) => {
                        if (ok) {
                            onDeleteBugBashItem(bugBashItem.bugBashId, bugBashItem.id!);
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

async function navigateToQueries(workItemIds: number[]) {
    const queryUrl = await getQueryUrlAsync(workItemIds, [
        CoreFieldRefNames.Id,
        CoreFieldRefNames.Title,
        CoreFieldRefNames.State,
        CoreFieldRefNames.AssignedTo,
        CoreFieldRefNames.AreaPath
    ]);

    openNewWindow(queryUrl);
}
