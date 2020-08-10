import "./SettingsApp.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as SDK from "azure-devops-extension-sdk";
import { Page } from "azure-devops-ui/Page";
import { useWorkItemTypes } from "Common/AzDev/WorkItemTypes/Hooks/useWorkItemTypes";
import { getWorkItemTypeModule } from "Common/AzDev/WorkItemTypes/Redux/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { ReduxHooksStoreProvider } from "Common/Redux";
import { createStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";

import { getChecklistModule } from "../../Redux/Checklist/Module";
import { ChecklistSettingsView } from "./ChecklistSettingsView";

function ChecklistSettingsInternal() {
    const { workItemTypes } = useWorkItemTypes();

    React.useEffect(() => {
        SDK.init({ applyTheme: true });
    }, []);

    const securityEnabled = window.location.search.indexOf("enable_security=true") >= 0;

    return (
        <Page className="checklist-settings flex-row flex-start flex-grow">
            {!workItemTypes && <Loading />}
            {workItemTypes && <ChecklistSettingsView workItemTypes={workItemTypes} securityEnabled={securityEnabled} />}
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
