import "./ChecklistGroup.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { WorkItemChecklistContext } from "Checklist/Constants";
import { ChecklistTabIds } from "Checklist/Interfaces";
import { getWorkItemChecklistModule } from "Checklist/Redux/WorkItemChecklist/Module";
import { WorkItemFormListener } from "Common/AzDev/WorkItemForm/Components/WorkItemFormListener";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import * as React from "react";
import { ChecklistCommandBar } from "./ChecklistCommandBar";
import { ChecklistView } from "./ChecklistView";

function ChecklistGroupInternal() {
    const [selectedTabId, setSelectedTabId] = React.useState(ChecklistTabIds.Shared);

    const onSelectedTabChanged = React.useCallback((selectedTab: ChecklistTabIds) => {
        setSelectedTabId(selectedTab);
    }, []);

    return (
        <WorkItemFormListener>
            {(activeWorkItemId: number, isNew: boolean, _isReadOnly: boolean) => (
                <Page className="checklist-group">
                    {isNew && (
                        <MessageCard className="checklist-message new-workitem-message" severity={MessageCardSeverity.Info}>
                            Save the work item before working with checklist.
                        </MessageCard>
                    )}
                    {!isNew && (
                        <WorkItemChecklistContext.Provider value={activeWorkItemId}>
                            <TabBar
                                className="checklist-tabbar"
                                tabSize={TabSize.Compact}
                                selectedTabId={selectedTabId}
                                onSelectedTabChanged={onSelectedTabChanged}
                                renderAdditionalContent={renderTabBarCommands}
                            >
                                <Tab name="Shared" id="shared" />
                                <Tab name="Personal" id="personal" />
                            </TabBar>
                            <div className="checklist-view-container">
                                <ChecklistView key={selectedTabId} />
                            </div>
                        </WorkItemChecklistContext.Provider>
                    )}
                </Page>
            )}
        </WorkItemFormListener>
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
