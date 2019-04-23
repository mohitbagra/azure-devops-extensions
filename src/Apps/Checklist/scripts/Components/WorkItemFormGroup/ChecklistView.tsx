import "./ChecklistView.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { WorkItemChecklistContext } from "Checklist/Constants";
import { useWorkItemChecklist } from "Checklist/Hooks/useWorkItemChecklist";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import * as React from "react";

interface IChecklistViewProps {}

export function ChecklistView(_props: IChecklistViewProps) {
    const workItemId = React.useContext(WorkItemChecklistContext);
    const { checklist, status, error } = useWorkItemChecklist(workItemId);

    if (!checklist || status === LoadStatus.NotLoaded || status === LoadStatus.Loading) {
        return <Loading />;
    } else if (checklist.checklistItems.length === 0) {
        return (
            <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                No checklist items added.
            </MessageCard>
        );
    } else {
        return (
            <>
                {error || ""}_{checklist.checklistItems.length}
            </>
        );
    }
}
