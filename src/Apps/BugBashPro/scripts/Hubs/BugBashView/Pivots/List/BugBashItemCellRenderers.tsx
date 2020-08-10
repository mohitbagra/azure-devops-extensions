import * as React from "react";

import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { Icon } from "azure-devops-ui/Icon";
import { ITableColumn, SimpleTableCell } from "azure-devops-ui/Table";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { ago } from "azure-devops-ui/Utilities/Date";
import { BugBashItemFieldNames, BugBashItemKeyTypes, WorkItemFieldNames } from "BugBashPro/Hubs/BugBashView/Constants";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted, isBugBashItemRejected, isWorkItemFieldName } from "BugBashPro/Shared/Helpers";
import { getBugBashItemUrlAsync } from "BugBashPro/Shared/NavHelpers";
import { TeamView } from "Common/AzDev/Teams/Components/TeamView";
import { WorkItemTitleView } from "Common/AzDev/WorkItemTitleView";
import { WorkItemStateView } from "Common/AzDev/WorkItemTypeStates/Components";
import { AsyncLinkComponent } from "Common/Components/AsyncComponent/AsyncLinkComponent";
import { IdentityView } from "Common/Components/IdentityView";
import { CoreFieldRefNames } from "Common/Constants";
import * as format from "date-fns/format";

export function onRenderBugBashItemCell(
    columnIndex: number,
    tableColumn: ITableColumn<IBugBashItem>,
    key: BugBashItemFieldNames | WorkItemFieldNames,
    bugBashItem: IBugBashItem,
    acceptedWorkItem: WorkItem | undefined,
    onTitleClick: (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void
): JSX.Element {
    let value: any;
    let isLink = false;

    const isAccepted = isBugBashItemAccepted(bugBashItem);
    if (isWorkItemFieldName(key)) {
        if (isAccepted && acceptedWorkItem) {
            value = key === WorkItemFieldNames.ID ? bugBashItem.workItemId : acceptedWorkItem.fields[key];
        }
    } else if (key === BugBashItemFieldNames.Title && isAccepted && acceptedWorkItem) {
        value = acceptedWorkItem.fields[WorkItemFieldNames.Title];
    } else if (key !== BugBashItemFieldNames.Status) {
        value = bugBashItem[key as keyof IBugBashItem];
    }

    let innerElement: JSX.Element | null = null;

    if (key === BugBashItemFieldNames.Status) {
        innerElement = renderStatusCell(bugBashItem);
    } else if (key === BugBashItemFieldNames.Title) {
        isLink = true;
        if (isAccepted) {
            innerElement = (
                <WorkItemTitleView
                    linkClassName="bolt-table-link"
                    workItemId={acceptedWorkItem!.id}
                    title={value as string}
                    workItemTypeName={acceptedWorkItem!.fields[WorkItemFieldNames.WorkItemType]}
                    onClick={onTitleClick}
                />
            );
        } else {
            innerElement = (
                <AsyncLinkComponent
                    key={bugBashItem.id}
                    className="text-ellipsis bolt-table-link"
                    getHrefAsync={getBugBashItemUrlPromise(bugBashItem.bugBashId, bugBashItem.id!)}
                    title={bugBashItem.title}
                    onClick={onTitleClick}
                />
            );
        }
    } else if (key === WorkItemFieldNames.State && isAccepted) {
        innerElement = <WorkItemStateView stateName={value as string} workItemTypeName={acceptedWorkItem!.fields[WorkItemFieldNames.WorkItemType]} />;
    } else if (key === BugBashItemFieldNames.TeamId) {
        if (isAccepted) {
            innerElement = (
                <Tooltip overflowOnly={true}>
                    <span className="text-ellipsis">{acceptedWorkItem!.fields[CoreFieldRefNames.AreaPath]}</span>
                </Tooltip>
            );
        } else {
            innerElement = <TeamView teamId={value} />;
        }
    } else if (BugBashItemKeyTypes[key] === "identityRef") {
        innerElement = <IdentityView value={value} />;
    } else if (BugBashItemKeyTypes[key] === "date") {
        innerElement = (
            <Tooltip text={format(value, "M/D/YYYY h:mm aa")}>
                <span className="text-ellipsis">{ago(value as Date)}</span>
            </Tooltip>
        );
    } else {
        innerElement = (
            <Tooltip overflowOnly={true}>
                <span className="text-ellipsis">{value}</span>
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

function getBugBashItemUrlPromise(bugBashId: string, bugBashItemId: string): () => Promise<string> {
    return async () => getBugBashItemUrlAsync(bugBashId, bugBashItemId);
}

function renderStatusCell(bugBashItem: IBugBashItem): JSX.Element {
    let tooltip: string;
    let iconName: string;
    let color: string;
    if (isBugBashItemAccepted(bugBashItem)) {
        tooltip = "Accepted";
        iconName = "Accept";
        color = "#107c10";
    } else if (isBugBashItemRejected(bugBashItem)) {
        tooltip = "Rejected";
        iconName = "Cancel";
        color = "#da0a00";
    } else {
        tooltip = "Pending";
        iconName = "Clock";
        color = "#666666";
    }
    return (
        <div style={{ textAlign: "center" }}>
            <Tooltip text={tooltip}>
                {Icon({
                    iconName: iconName,
                    style: {
                        color: color,
                        cursor: "default"
                    }
                })}
            </Tooltip>
        </div>
    );
}
