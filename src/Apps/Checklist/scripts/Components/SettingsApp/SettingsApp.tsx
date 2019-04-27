import "./SettingsApp.scss";

import * as SDK from "azure-devops-extension-sdk";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabList, TabSize } from "azure-devops-ui/Tabs";
import { ChecklistView } from "Checklist/Components/Shared/ChecklistView";
import { ChecklistContext } from "Checklist/Constants";
import { ChecklistType } from "Checklist/Interfaces";
import { getChecklistModule } from "Checklist/Redux/Module";
import { WorkItemTypeIcon } from "Common/AzDev/WorkItemTypes/Components/WorkItemTypeIcon";
import { useWorkItemTypes } from "Common/AzDev/WorkItemTypes/Hooks/useWorkItemTypes";
import { getWorkItemTypeModule } from "Common/AzDev/WorkItemTypes/Redux/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { ReduxHooksStoreProvider } from "Common/Redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";

function ChecklistSettingsInternal() {
    const [selectedWorkItemType, setSelectedWorkItemType] = React.useState("");
    const { workItemTypes } = useWorkItemTypes();

    React.useEffect(() => {
        SDK.init({ applyTheme: true });
    }, []);

    const onSelectedTabChanged = React.useCallback((selectedTab: string) => {
        setSelectedWorkItemType(selectedTab);
    }, []);

    return (
        <Page className="checklist-group flex-row flex-center flex-grow">
            {!workItemTypes && <Loading />}
            {workItemTypes && (
                <ChecklistContext.Provider value={selectedWorkItemType}>
                    <TabList
                        className="checklist-tabbar"
                        tabSize={TabSize.Tall}
                        selectedTabId={selectedWorkItemType}
                        onSelectedTabChanged={onSelectedTabChanged}
                    >
                        {workItemTypes.map(w => (
                            <Tab
                                key={w.name}
                                name={w.name}
                                id={w.name}
                                iconProps={{
                                    render: () => <WorkItemTypeIcon className="tab-icon" workItemTypeName={w.name} />
                                }}
                            />
                        ))}
                    </TabList>
                    {selectedWorkItemType && (
                        <div className="checklist-view-container flex-grow">
                            <ChecklistView checklistType={ChecklistType.WitDefault} />
                        </div>
                    )}
                </ChecklistContext.Provider>
            )}
        </Page>
    );
}

function ChecklistSettings() {
    return (
        <DynamicModuleLoader modules={[getChecklistModule(), getWorkItemTypeModule()]} cleanOnUnmount={true}>
            <ChecklistSettingsInternal />
        </DynamicModuleLoader>
    );
}

const store = createStore({}, [], [getSagaExtension()]);

ReactDOM.render(
    <ReduxHooksStoreProvider value={store}>
        <ChecklistSettings />
    </ReduxHooksStoreProvider>,
    document.getElementById("ext-container")
);
