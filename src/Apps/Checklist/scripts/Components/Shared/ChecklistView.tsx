import "./ChecklistView.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Loading } from "Common/Components/Loading";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklist } from "../../Hooks/useChecklist";
import { ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistItem } from "./ChecklistItem";

interface IChecklistViewProps {
    checklistType: ChecklistType;
}

export function ChecklistView(props: IChecklistViewProps) {
    const { checklistType } = props;
    const idOrType = React.useContext(ChecklistContext);
    const checklist = useChecklist(idOrType, checklistType);

    if (!checklist) {
        return <Loading />;
    }

    return (
        <div className="checklist-view flex-column">
            {checklist.checklistItems.length === 0 && (
                <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                    No checklist items added.
                </MessageCard>
            )}
            {checklist.checklistItems.length > 0 && (
                <div className="checklist-items-container flex-grow scroll-auto">
                    {checklist.checklistItems.map((checklistItem: IChecklistItem) => (
                        <ChecklistItem key={`checklist_${checklistItem.id}`} checklistItem={checklistItem} checklistType={checklistType} />
                    ))}
                </div>
            )}
        </div>
    );
}
