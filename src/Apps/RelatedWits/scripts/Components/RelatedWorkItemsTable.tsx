import { WorkItem } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import * as React from "react";

interface IRelatedWorkItemsTableProps {
    workItems: WorkItem[];
}

export function RelatedWorkItemsTable(props: IRelatedWorkItemsTableProps) {
    const { workItems } = props;
    return <>{workItems.length}</>;
}
