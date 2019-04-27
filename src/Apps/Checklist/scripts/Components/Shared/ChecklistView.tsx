import "./ChecklistView.scss";

import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { css } from "azure-devops-ui/Util";
import { ChecklistContext } from "Checklist/Constants";
import { useChecklist } from "Checklist/Hooks/useChecklist";
import { ChecklistType, IChecklistItem } from "Checklist/Interfaces";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";
import { ChecklistItem } from "./ChecklistItem";
import { ChecklistItemEditor } from "./ChecklistItemEditor";

interface IChecklistViewProps {
    checklistType: ChecklistType;
    className?: string;
}

export function ChecklistView(props: IChecklistViewProps) {
    const { className, checklistType } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { checklist, status, error } = useChecklist(idOrType, checklistType);

    if (!checklist || status === LoadStatus.NotLoaded) {
        return <Loading />;
    }

    const disabled = status === LoadStatus.Loading || status === LoadStatus.UpdateFailed || status === LoadStatus.Updating;
    return (
        <div className={css("checklist-view flex-column", className)}>
            <ConditionalChildren renderChildren={!isNullOrWhiteSpace(error)}>
                <MessageCard className="checklist-message compact" severity={MessageCardSeverity.Error}>
                    {error}
                </MessageCard>
            </ConditionalChildren>
            <ConditionalChildren renderChildren={checklist.checklistItems.length === 0}>
                <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                    No checklist items added.
                </MessageCard>
            </ConditionalChildren>
            <div className="checklist-items-container flex-grow scroll-auto">
                {checklist.checklistItems.map((checklistItem: IChecklistItem) => (
                    <ChecklistItem
                        key={`checklist_${checklistItem.id}`}
                        disabled={disabled}
                        checklistItem={checklistItem}
                        checklistType={checklistType}
                    />
                ))}
            </div>
            <ChecklistItemEditor checklistType={checklistType} disabled={disabled} />
        </div>
    );
}
