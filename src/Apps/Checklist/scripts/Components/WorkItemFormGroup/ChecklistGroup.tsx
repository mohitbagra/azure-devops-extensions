import "./ChecklistGroup.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { WorkItemChecklistContext } from "Checklist/Constants";
import { getWorkItemChecklistModule } from "Checklist/Redux/WorkItemChecklist/Module";
import { WorkItemFormListener } from "Common/AzDev/WorkItemForm/Components/WorkItemFormListener";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import * as React from "react";
import { ChecklistCommandBar } from "./ChecklistCommandBar";
import { ChecklistView } from "./ChecklistView";

function ChecklistGroupInternal() {
    const [selectedTabId, setSelectedTabId] = React.useState("shared");

    return (
        <Page className="checklist-container">
            <WorkItemFormListener>
                {(activeWorkItemId: number, isNew: boolean, _isReadOnly: boolean) => {
                    if (isNew) {
                        return (
                            <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                                You need to save the workitem before working with checklist.
                            </MessageCard>
                        );
                    } else {
                        return (
                            <WorkItemChecklistContext.Provider value={activeWorkItemId}>
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
                                <div className="checklist-view-container">
                                    <ChecklistView key={selectedTabId} />
                                </div>
                            </WorkItemChecklistContext.Provider>
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

export function ChecklistGroup() {
    return (
        <DynamicModuleLoader modules={[getWorkItemChecklistModule()]} cleanOnUnmount={true}>
            <ChecklistGroupInternal />
        </DynamicModuleLoader>
    );
}
