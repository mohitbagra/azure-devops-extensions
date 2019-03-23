import { ColumnMore, ITableColumn as VSSUI_ITableColumn, ITableRow, SimpleTableCell, SortOrder } from "azure-devops-ui/Table";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { ZeroData } from "azure-devops-ui/ZeroData";
import { BugBashEditorPortalActions } from "BugBashPro/Portals/BugBashEditorPortal/Redux";
import { Resources } from "BugBashPro/Resources";
import { AppView } from "BugBashPro/Shared/Constants";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { getBugBashViewUrlAsync, navigateToBugBashItemsList } from "BugBashPro/Shared/NavHelpers";
import { BugBashesActions } from "BugBashPro/Shared/Redux/BugBashes/Actions";
import { AsyncLinkComponent } from "Common/Components/AsyncComponent/AsyncLinkComponent";
import { Loading } from "Common/Components/Loading";
import { ITableColumn, Table } from "Common/Components/Table";
import { ColumnSorting } from "Common/Components/Table/ColumnSorting";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";
import * as format from "date-fns/format";
import * as React from "react";
import { BugBashFieldNames } from "../Constants";
import { useBugBashesSort } from "../Hooks/useBugBashesSort";
import { useFilteredBugBashes } from "../Hooks/useFilteredBugBashes";

const Actions = {
    openEditorPanel: BugBashEditorPortalActions.openPortal,
    deleteBugBash: BugBashesActions.bugBashDeleteRequested
};

export function BugBashDirectoryTable() {
    const { sortColumn, isSortedDescending, applySort } = useBugBashesSort();
    const { filteredBugBashes, status } = useFilteredBugBashes();
    const { openEditorPanel, deleteBugBash } = useActionCreators(Actions);

    const isLoading = status === LoadStatus.Loading || status === LoadStatus.NotLoaded;
    const columns = React.useMemo(() => getColumns(sortColumn, isSortedDescending, deleteBugBash, openEditorPanel), [sortColumn, isSortedDescending]);
    const sortingBehavior = React.useMemo(
        () =>
            new ColumnSorting<IBugBash>((proposedColumn: VSSUI_ITableColumn<IBugBash>, proposedSortOrder: SortOrder) => {
                applySort({
                    sortKey: proposedColumn.id,
                    isSortedDescending: proposedSortOrder === SortOrder.descending
                });
            }),
        []
    );

    if (!filteredBugBashes || isLoading) {
        return <Loading />;
    }
    if (filteredBugBashes.length === 0) {
        return <ZeroData className="flex-grow" imagePath="../images/nodata.png" imageAltText="" primaryText={Resources.ZeroDataText} />;
    }

    return (
        <Table<IBugBash>
            columns={columns}
            items={filteredBugBashes}
            scrollable={true}
            showLines={false}
            singleClickActivation={false}
            onActivate={onRowActivate}
            behaviors={[sortingBehavior]}
        />
    );
}

function getBugBashUrlPromise(bugBashId: string): () => Promise<string> {
    return async () => getBugBashViewUrlAsync(bugBashId, AppView.ACTION_LIST);
}

function getColumns(
    sortColumn: string | undefined,
    isSortedDescending: boolean | undefined,
    onDelete: (bugBashId: string) => void,
    onEdit: (bugBashId: string) => void
): ITableColumn<IBugBash>[] {
    return [
        {
            id: BugBashFieldNames.Title,
            name: Resources.TitleColumn,
            minWidth: 300,
            maxWidth: 1500,
            width: -50,
            isSorted: sortColumn === BugBashFieldNames.Title,
            isSortedDescending: isSortedDescending,
            renderCell: (_rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IBugBash>, bugBash: IBugBash) => {
                return (
                    <SimpleTableCell columnIndex={columnIndex} tableColumn={tableColumn} key={`col-${columnIndex}`}>
                        <AsyncLinkComponent
                            key={bugBash.id}
                            className="text-ellipsis bolt-table-link bolt-table-inline-link flex-grow"
                            getHrefAsync={getBugBashUrlPromise(bugBash.id!)}
                            title={bugBash.title}
                            onClick={onLinkClick(bugBash)}
                        />
                    </SimpleTableCell>
                );
            }
        },
        {
            id: BugBashFieldNames.StartTime,
            name: Resources.StartTimeColumn,
            minWidth: 400,
            maxWidth: 600,
            width: -25,
            isSorted: sortColumn === BugBashFieldNames.StartTime,
            isSortedDescending: isSortedDescending,
            renderCell: (_rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IBugBash>, bugBash: IBugBash) => {
                const startTime = bugBash.startTime;
                const label = startTime ? format(startTime, "MMMM DD, YYYY, hh:mm A") : "N/A";
                return (
                    <SimpleTableCell columnIndex={columnIndex} tableColumn={tableColumn} key={`col-${columnIndex}`}>
                        <div className="flex-row scroll-hidden">
                            <Tooltip overflowOnly={true}>
                                <span className="text-ellipsis">{label}</span>
                            </Tooltip>
                        </div>
                    </SimpleTableCell>
                );
            }
        },
        {
            id: BugBashFieldNames.EndTime,
            name: Resources.EndTimeColumn,
            minWidth: 400,
            maxWidth: 600,
            width: -25,
            isSorted: sortColumn === BugBashFieldNames.EndTime,
            isSortedDescending: isSortedDescending,
            renderCell: (_rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IBugBash>, bugBash: IBugBash) => {
                const endTime = bugBash.endTime;
                const label = endTime ? format(endTime, "MMMM DD, YYYY, hh:mm A") : "N/A";
                return (
                    <SimpleTableCell columnIndex={columnIndex} tableColumn={tableColumn} key={`col-${columnIndex}`}>
                        <div className="flex-row scroll-hidden">
                            <Tooltip overflowOnly={true}>
                                <span className="text-ellipsis">{label}</span>
                            </Tooltip>
                        </div>
                    </SimpleTableCell>
                );
            }
        },
        new ColumnMore((bugBash: IBugBash) => {
            return {
                id: "sub-menu",
                items: [
                    {
                        id: "list",
                        text: Resources.Open,
                        onActivate: () => {
                            navigateToBugBashItemsList(bugBash.id!);
                        },
                        iconProps: { iconName: "ReplyMirrored", className: "communication-foreground" }
                    },
                    {
                        id: "edit",
                        text: Resources.Edit,
                        onActivate: () => {
                            onEdit(bugBash.id!);
                        },
                        iconProps: { iconName: "Edit", className: "communication-foreground" }
                    },
                    {
                        id: "delete",
                        text: Resources.Delete,
                        onActivate: () => {
                            confirmAction(Resources.ConfirmDialogTitle, Resources.DeleteBugBashConfirmation, (ok: boolean) => {
                                if (ok) {
                                    onDelete(bugBash.id!);
                                }
                            });
                        },
                        iconProps: { iconName: "Cancel", className: "error-text" }
                    }
                ]
            };
        })
    ];
}

function onLinkClick(bugBash: IBugBash) {
    return (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
        if (!e.ctrlKey) {
            e.preventDefault();
            navigateToBugBashItemsList(bugBash.id!);
        }
    };
}

function onRowActivate(_event: React.SyntheticEvent<HTMLElement>, tableRow: ITableRow<IBugBash>) {
    navigateToBugBashItemsList(tableRow.data.id!);
}
