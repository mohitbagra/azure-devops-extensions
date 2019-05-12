import "./ChecklistGroup.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Page } from "azure-devops-ui/Page";
import { WorkItemFormListener } from "Common/AzDev/WorkItemForm/Components/WorkItemFormListener";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { ChecklistType } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import { getChecklistModule } from "../../Redux/Checklist/Module";
import { getChecklistSettingsModule } from "../../Redux/Settings/Module";
import { ChecklistError } from "../Shared/ChecklistError";
import { ChecklistItemEditor } from "../Shared/ChecklistItemEditor";
import { ChecklistItemsProvider } from "../Shared/ChecklistItemsProvider";
import { ChecklistView } from "../Shared/ChecklistView";
import { ChecklistGroupTabBar } from "./ChecklistGroupTabBar";

const Actions = {
    resizeIframe: ChecklistActions.resizeIframe
};

function ChecklistGroupInternal() {
    const [selectedTabId, setSelectedTabId] = React.useState(ChecklistType.Shared);
    const { resizeIframe } = useActionCreators(Actions);

    const onSelectedTabChanged = React.useCallback((selectedTab: ChecklistType) => {
        setSelectedTabId(selectedTab);
        resizeIframe(50);
    }, []);

    return (
        <WorkItemFormListener>
            {(activeWorkItemId: number, isNew: boolean, _isReadOnly: boolean) => (
                <Page className="checklist-form-group">
                    {isNew && (
                        <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                            Save the work item before working with checklist.
                        </MessageCard>
                    )}
                    {!isNew && (
                        <ChecklistContext.Provider value={activeWorkItemId}>
                            <ChecklistGroupTabBar selectedTabId={selectedTabId} onSelectedTabChanged={onSelectedTabChanged} />
                            <div className="checklist-contents flex-column">
                                <ChecklistError className="flex-noshrink" />
                                <ChecklistItemsProvider checklistType={selectedTabId}>
                                    {({ personal, shared, witDefault }) => {
                                        const selectedChecklist = selectedTabId === ChecklistType.Shared ? shared : personal;
                                        return (
                                            <div className="checklists-container flex-grow scroll-auto">
                                                {selectedTabId === ChecklistType.Shared && witDefault.length > 0 && (
                                                    <ChecklistView
                                                        checklistType={ChecklistType.WitDefault}
                                                        checklistItems={witDefault}
                                                        itemProps={{
                                                            canDeleteItem: false,
                                                            canEditItem: false,
                                                            canUpdateItemState: true
                                                        }}
                                                        disableDragDrop={true}
                                                    />
                                                )}
                                                {selectedChecklist.length > 0 && (
                                                    <ChecklistView
                                                        checklistType={selectedTabId}
                                                        checklistItems={selectedChecklist}
                                                        itemProps={{
                                                            canDeleteItem: true,
                                                            canEditItem: true,
                                                            canUpdateItemState: true
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    }}
                                </ChecklistItemsProvider>
                                <ChecklistItemEditor checklistType={selectedTabId} className="flex-noshrink" canUpdateItemState={false} />
                            </div>
                        </ChecklistContext.Provider>
                    )}
                </Page>
            )}
        </WorkItemFormListener>
    );
}

export function ChecklistGroup() {
    return (
        <DynamicModuleLoader modules={[getChecklistModule(), getChecklistSettingsModule()]} cleanOnUnmount={true}>
            <ChecklistGroupInternal />
        </DynamicModuleLoader>
    );
}
