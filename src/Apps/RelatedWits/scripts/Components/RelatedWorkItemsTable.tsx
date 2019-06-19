import { WorkItem, WorkItemRelation, WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ListSelection } from "azure-devops-ui/Components/List/ListSelection";
import { ColumnMore, ColumnSelect, ITableColumn as VSSUI_ITableColumn, SimpleTableCell, SortOrder } from "azure-devops-ui/Table";
import { InfoLabel } from "Common/Components/InfoLabel";
import { ITableColumn, Table } from "Common/Components/Table";
import { ColumnSorting } from "Common/Components/Table/ColumnSorting";
import { CoreFieldRefNames } from "Common/Constants";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { openNewWindow } from "Common/ServiceWrappers/HostNavigationService";
import { getWorkItemFormService } from "Common/ServiceWrappers/WorkItemFormServices";
import { getQueryUrlAsync } from "Common/Utilities/UrlHelper";
import * as React from "react";
import { RelatedWorkItemActions } from "../Redux/Actions";
import { IRelatedWitsAwareState } from "../Redux/Contracts";
import { getActiveWorkItemRelationsMap, getActiveWorkItemRelationTypes, getSortColumn, isSortedDescending } from "../Redux/Selectors";
import { onRenderWorkItemCell } from "./CellRenderers";

interface IRelatedWorkItemsTableProps {
    workItems: WorkItem[];
}

const Actions = {
    applySort: RelatedWorkItemActions.applySort,
    openRelatedWorkItem: RelatedWorkItemActions.openRelatedWorkItem
};

const mapState = (state: IRelatedWitsAwareState) => {
    return {
        sortColumn: getSortColumn(state),
        isSortedDescending: isSortedDescending(state),
        relationsMap: getActiveWorkItemRelationsMap(state),
        relationTypes: getActiveWorkItemRelationTypes(state)
    };
};

export function RelatedWorkItemsTable(props: IRelatedWorkItemsTableProps) {
    const { workItems } = props;
    const { sortColumn, isSortedDescending, relationsMap, relationTypes } = useMappedState(mapState);
    const { applySort, openRelatedWorkItem } = useActionCreators(Actions);
    const selectionRef = React.useRef(new ListSelection(true));

    const columns = React.useMemo(
        () => getColumns(workItems, selectionRef.current, relationsMap, relationTypes, sortColumn, isSortedDescending, openRelatedWorkItem),
        [workItems, sortColumn, isSortedDescending, relationsMap, relationTypes]
    );

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
            selection={selectionRef.current}
        />
    );
}

function getColumns(
    workItems: WorkItem[],
    selection: ListSelection,
    relationsMap: { [key: string]: boolean },
    relationTypes: WorkItemRelationType[],
    sortColumn: string | undefined,
    isSortedDescending: boolean,
    openRelatedWorkItem: (workItemId: number) => void
): ITableColumn<WorkItem>[] {
    return [
        new ColumnSelect(),
        {
            id: "linked",
            name: "Linked",
            minWidth: 60,
            maxWidth: 100,
            width: 100,
            readonly: true,
            resizable: false,
            renderCell: (_1: unknown, columnIndex: number, tableColumn: ITableColumn<WorkItem>, workItem: WorkItem) => {
                const availableLinks: string[] = [];
                let innerElement: JSX.Element;

                relationTypes.forEach(r => {
                    if (relationsMap[`${workItem.url}_${r.referenceName}`]) {
                        availableLinks.push(r.name);
                    }
                });
                if (availableLinks.length > 0) {
                    innerElement = (
                        <InfoLabel className="linked-cell" label="Linked" info={`Linked to this workitem as ${availableLinks.join("; ")}`} />
                    );
                } else {
                    innerElement = (
                        <InfoLabel label="Not linked" className="unlinked-cell" info="This workitem is not linked to the current work item." />
                    );
                }

                return (
                    <SimpleTableCell columnIndex={columnIndex} tableColumn={tableColumn} key={`col-${columnIndex}`}>
                        {innerElement}
                    </SimpleTableCell>
                );
            }
        },
        getColumn(CoreFieldRefNames.Id, "ID", { min: 80, max: 80, width: 80 }, sortColumn, isSortedDescending),
        getColumn(CoreFieldRefNames.Title, "Title", { min: 300, max: 1500, width: -40 }, sortColumn, isSortedDescending, openRelatedWorkItem),
        getColumn(CoreFieldRefNames.State, "State", { min: 150, max: 500, width: -20 }, sortColumn, isSortedDescending),
        getColumn(CoreFieldRefNames.AssignedTo, "Assigned to", { min: 150, max: 500, width: -20 }, sortColumn, isSortedDescending),
        getColumn(CoreFieldRefNames.AreaPath, "Area Path", { min: 150, max: 500, width: -20 }, sortColumn, isSortedDescending),
        new ColumnMore(() => {
            return {
                id: "context-menu",
                items: [
                    {
                        id: "open",
                        text: "Open selected items",
                        iconProps: { iconName: "ReplyMirrored", className: "communication-foreground" },
                        onActivate: () => {
                            const selectedWorkItemIds: number[] = [];
                            const ranges = selection.value;
                            for (const range of ranges) {
                                const { endIndex, beginIndex } = range;
                                selectedWorkItemIds.push(...workItems.slice(beginIndex, endIndex + 1).map(w => w.id));
                            }
                            navigateToQueries(selectedWorkItemIds);
                        }
                    },
                    {
                        id: "add-link",
                        text: "Add Link",
                        iconProps: { iconName: "Link", className: "communication-foreground" },
                        subMenuProps: {
                            id: "add-link-sub-menu",
                            onActivate: async item => {
                                const relationRefName = item.id;
                                const workItemFormService = await getWorkItemFormService();
                                const selectedWorkItems: WorkItem[] = [];
                                const ranges = selection.value;
                                for (const range of ranges) {
                                    const { endIndex, beginIndex } = range;
                                    selectedWorkItems.push(...workItems.slice(beginIndex, endIndex + 1));
                                }

                                const workItemRelations = selectedWorkItems
                                    .filter(wi => !relationsMap[`${wi.url}_${relationRefName}`])
                                    .map(w => {
                                        return {
                                            rel: relationRefName,
                                            attributes: {
                                                isLocked: false
                                            },
                                            url: w.url
                                        } as WorkItemRelation;
                                    });

                                if (workItemRelations) {
                                    workItemFormService.addWorkItemRelations(workItemRelations);
                                }
                            },
                            items: relationTypes
                                .filter(r => r.name != null && r.name.trim() !== "")
                                .map(rt => ({
                                    id: rt.referenceName,
                                    text: rt.name
                                }))
                        }
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
    isSortedDescending: boolean,
    openRelatedWorkItem?: (workItemId: number) => void
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
            return onRenderWorkItemCell(
                columnIndex,
                tableColumn,
                key,
                workItem,
                openRelatedWorkItem
                    ? (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
                          if (!e.ctrlKey) {
                              e.preventDefault();
                              openRelatedWorkItem(workItem.id);
                          }
                      }
                    : undefined
            );
        }
    };
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
