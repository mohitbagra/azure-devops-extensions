import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Loading } from "Common/Components/Loading";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklist } from "../../Hooks/useChecklist";
import { ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistItem } from "../Shared/ChecklistItem";

export function SharedChecklistView() {
    const idOrType = React.useContext(ChecklistContext);
    const sharedChecklist = useChecklist(idOrType, ChecklistType.Shared);
    const witDefaultChecklist = useChecklist(idOrType, ChecklistType.WitDefault);

    if (!sharedChecklist || !witDefaultChecklist) {
        return <Loading />;
    }

    const isEmpty = sharedChecklist.checklistItems.length + witDefaultChecklist.checklistItems.length === 0;
    return (
        <div className="checklist-view flex-column">
            {isEmpty && (
                <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                    No checklist items added.
                </MessageCard>
            )}
            {!isEmpty && (
                <div className="checklist-items-container flex-grow scroll-auto">
                    {witDefaultChecklist.checklistItems.length > 0 && (
                        <div className="checklist-items-group">
                            {witDefaultChecklist.checklistItems.map((checklistItem: IChecklistItem) => (
                                <ChecklistItem
                                    key={`checklist_${checklistItem.id}`}
                                    checklistItem={checklistItem}
                                    checklistType={ChecklistType.Shared}
                                />
                            ))}
                        </div>
                    )}
                    {sharedChecklist.checklistItems.length > 0 && (
                        <div className="checklist-items-group">
                            {sharedChecklist.checklistItems.map((checklistItem: IChecklistItem) => (
                                <ChecklistItem
                                    key={`checklist_${checklistItem.id}`}
                                    checklistItem={checklistItem}
                                    checklistType={ChecklistType.Shared}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
