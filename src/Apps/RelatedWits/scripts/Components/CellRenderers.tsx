import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { ITableColumn, SimpleTableCell } from "azure-devops-ui/Table";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { WorkItemTitleView } from "Common/AzDev/WorkItemTitleView";
import { WorkItemStateView } from "Common/AzDev/WorkItemTypeStates/Components";
import { IdentityView } from "Common/Components/IdentityView";
import { CoreFieldRefNames } from "Common/Constants";
import * as React from "react";

export function onRenderWorkItemCell(
    columnIndex: number,
    tableColumn: ITableColumn<WorkItem>,
    key: string,
    workItem: WorkItem,
    onTitleClick?: (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void
): JSX.Element {
    let isLink = false;
    let innerElement: JSX.Element | null = null;

    if (key === CoreFieldRefNames.Id) {
        innerElement = (
            <Tooltip overflowOnly={true}>
                <span className="text-ellipsis">{workItem.id}</span>
            </Tooltip>
        );
    } else if (key === CoreFieldRefNames.Title) {
        isLink = true;
        innerElement = (
            <WorkItemTitleView
                linkClassName="bolt-table-link"
                workItemId={workItem.id}
                hideId={true}
                title={workItem.fields[key] as string}
                workItemTypeName={workItem.fields[CoreFieldRefNames.WorkItemType]}
                onClick={onTitleClick}
            />
        );
    } else if (key === CoreFieldRefNames.State) {
        innerElement = (
            <WorkItemStateView stateName={workItem.fields[key] as string} workItemTypeName={workItem.fields[CoreFieldRefNames.WorkItemType]} />
        );
    } else if (key === CoreFieldRefNames.AssignedTo) {
        innerElement = <IdentityView value={workItem.fields[key]} />;
    } else {
        innerElement = (
            <Tooltip overflowOnly={true}>
                <span className="text-ellipsis">{workItem.fields[key]}</span>
            </Tooltip>
        );
    }

    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={`col-${columnIndex}`}
            contentClassName={isLink ? "bolt-table-cell-content-with-link" : undefined}
        >
            {innerElement}
        </SimpleTableCell>
    );
}
