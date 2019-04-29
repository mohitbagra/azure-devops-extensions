import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistError } from "../../Hooks/useChecklistError";

export function ChecklistError() {
    const idOrType = React.useContext(ChecklistContext);
    const error = useChecklistError(idOrType);

    if (error) {
        return (
            <MessageCard className="checklist-message compact" severity={MessageCardSeverity.Error}>
                {error}
            </MessageCard>
        );
    }

    return null;
}
