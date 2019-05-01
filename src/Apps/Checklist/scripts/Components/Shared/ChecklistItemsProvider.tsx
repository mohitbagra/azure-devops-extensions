import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Loading } from "Common/Components/Loading";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklists } from "../../Hooks/useChecklists";
import { ChecklistType, IChecklistItem } from "../../Interfaces";

interface IChecklistItemsProviderProps {
    children: (checklistItems: { personal: IChecklistItem[]; shared: IChecklistItem[]; witDefault: IChecklistItem[] }) => JSX.Element;
    checklistType: ChecklistType;
}

export function ChecklistItemsProvider(props: IChecklistItemsProviderProps) {
    const { children, checklistType } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { personalChecklist, sharedChecklist, witDefaultChecklist } = useChecklists(idOrType);

    if (!personalChecklist || !sharedChecklist || !witDefaultChecklist) {
        return <Loading />;
    }

    const isEmpty =
        checklistType === ChecklistType.Personal
            ? personalChecklist.checklistItems.length === 0
            : checklistType === ChecklistType.WitDefault
            ? witDefaultChecklist.checklistItems.length === 0
            : witDefaultChecklist.checklistItems.length + sharedChecklist.checklistItems.length === 0;

    if (isEmpty) {
        return (
            <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                No checklist items added.
            </MessageCard>
        );
    }
    return children({
        personal: personalChecklist.checklistItems,
        shared: sharedChecklist.checklistItems,
        witDefault: witDefaultChecklist.checklistItems
    });
}
