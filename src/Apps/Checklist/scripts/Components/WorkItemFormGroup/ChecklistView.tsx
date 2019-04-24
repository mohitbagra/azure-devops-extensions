import "./ChecklistView.scss";

import * as SDK from "azure-devops-extension-sdk";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { css } from "azure-devops-ui/Util";
import { WorkItemChecklistContext } from "Checklist/Constants";
import { useWorkItemChecklist } from "Checklist/Hooks/useWorkItemChecklist";
import { ChecklistTabIds, IChecklistItem } from "Checklist/Interfaces";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";
import { ChecklistItem } from "./ChecklistItem";
import { ChecklistItemEditor } from "./ChecklistItemEditor";

interface IChecklistViewProps {
    key: ChecklistTabIds;
    className?: string;
}

const WIDTH_DELTA = 10;
const MIN_HEIGHT_THRESHOLD = 10;

export function ChecklistView(props: IChecklistViewProps) {
    const { className } = props;
    const workItemId = React.useContext(WorkItemChecklistContext);
    const { checklist, status, error } = useWorkItemChecklist(workItemId);
    const [width, setWidth] = React.useState(window.innerWidth);

    React.useEffect(() => {
        fillBodyHeight();
    }, []);

    React.useEffect(() => {
        let timeout: number;
        const handleResize = () => {
            if (Math.abs(width - window.innerWidth) > WIDTH_DELTA) {
                clearTimeout(timeout);
                timeout = window.setTimeout(() => {
                    setWidth(window.innerWidth);
                    fillBodyHeight();
                }, 50);
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (!checklist || status === LoadStatus.NotLoaded || status === LoadStatus.Loading) {
        return <Loading />;
    }

    return (
        <div className={css("checklist-view flex-column scroll-hidden", className)}>
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
            <div className="checklist-items-container flex-column flex-grow scroll-auto">
                {checklist.checklistItems.map((checklistItem: IChecklistItem) => (
                    <ChecklistItem key={`checklist_${checklistItem.id}`} className="checklist-item-container" checklistItem={checklistItem} />
                ))}
            </div>
            <ChecklistItemEditor />
        </div>
    );
}

function fillBodyHeight() {
    const bodyElement = document.getElementsByTagName("body").item(0) as HTMLBodyElement;
    if (bodyElement.offsetHeight > MIN_HEIGHT_THRESHOLD) {
        SDK.resize(undefined, bodyElement.offsetHeight);
    }
}
