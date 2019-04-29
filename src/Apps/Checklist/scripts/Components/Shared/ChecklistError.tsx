import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { ChecklistContext } from "Checklist/Constants";
import { useChecklist } from "Checklist/Hooks/useChecklist";
import { ChecklistType } from "Checklist/Interfaces";
import * as React from "react";

export function ChecklistError() {
    const idOrType = React.useContext(ChecklistContext);
    const { error } = useChecklist(idOrType, ChecklistType.Personal, false);

    if (error) {
        return (
            <MessageCard className="checklist-message compact" severity={MessageCardSeverity.Error}>
                {error}
            </MessageCard>
        );
    }

    return null;
}
