import "./ChecklistGroup.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { WorkItemFormListener } from "Common/AzDev/WorkItemForm/Components/WorkItemFormListener";
import * as React from "react";
import { ChecklistCommandBar } from "./ChecklistCommandBar";

export function ChecklistGroup() {
    const [selectedTabId, setSelectedTabId] = React.useState("shared");

    return (
        <Page className="checklist-container">
            <WorkItemFormListener>
                {(_activeWorkItemId: number, isNew: boolean, _isReadOnly: boolean) => {
                    if (isNew) {
                        return (
                            <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                                You need to save the workitem before working with checklist.
                            </MessageCard>
                        );
                    } else {
                        return (
                            <TabBar
                                className="checklist-tabbar"
                                tabSize={TabSize.Compact}
                                selectedTabId={selectedTabId}
                                onSelectedTabChanged={setSelectedTabId}
                                renderAdditionalContent={renderTabBarCommands}
                            >
                                <Tab name="Shared" id="shared" />
                                <Tab name="Personal" id="personal" />
                            </TabBar>
                        );
                    }
                }}
            </WorkItemFormListener>
        </Page>
    );
}

function renderTabBarCommands() {
    return <ChecklistCommandBar />;
}
