import "./ChecklistGroup.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { ChecklistView } from "Checklist/Components/Shared/ChecklistView";
import { ChecklistContext } from "Checklist/Constants";
import { ChecklistType } from "Checklist/Interfaces";
import { getChecklistModule } from "Checklist/Redux/Module";
import { WorkItemFormListener } from "Common/AzDev/WorkItemForm/Components/WorkItemFormListener";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import * as React from "react";
import { ChecklistError } from "../Shared/ChecklistError";
import { ChecklistItemEditor } from "../Shared/ChecklistItemEditor";
import { ChecklistCommandBar } from "./ChecklistCommandBar";

function ChecklistGroupInternal() {
    const [selectedTabId, setSelectedTabId] = React.useState(ChecklistType.Shared);

    const onSelectedTabChanged = React.useCallback((selectedTab: ChecklistType) => {
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
                        <ChecklistContext.Provider value={activeWorkItemId}>
                            <TabBar
                                className="checklist-tabbar"
                                tabSize={TabSize.Compact}
                                selectedTabId={selectedTabId}
                                onSelectedTabChanged={onSelectedTabChanged}
                                renderAdditionalContent={renderTabBarCommands}
                            >
                                <Tab name="Shared" id={ChecklistType.Shared} />
                                <Tab name="Personal" id={ChecklistType.Personal} />
                            </TabBar>
                            <ChecklistError />
                            {selectedTabId === ChecklistType.Shared && (
                                <div className="checklist-view-container">
                                    <ChecklistView checklistType={ChecklistType.WitDefault} />
                                </div>
                            )}
                            <div className="checklist-view-container">
                                <ChecklistView checklistType={selectedTabId} />
                            </div>
                            <ChecklistItemEditor checklistType={selectedTabId} />
                        </ChecklistContext.Provider>
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
        <DynamicModuleLoader modules={[getChecklistModule()]} cleanOnUnmount={true}>
            <ChecklistGroupInternal />
        </DynamicModuleLoader>
    );
}
