import "./SettingsApp.scss";

import * as SDK from "azure-devops-extension-sdk";
import { Page } from "azure-devops-ui/Page";
import { getChecklistModule } from "Checklist/Redux/Module";
import { useWorkItemTypes } from "Common/AzDev/WorkItemTypes/Hooks/useWorkItemTypes";
import { getWorkItemTypeModule } from "Common/AzDev/WorkItemTypes/Redux/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { ReduxHooksStoreProvider } from "Common/Redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { ChecklistSettingsView } from "./ChecklistSettingsView";

function ChecklistSettingsInternal() {
    const { workItemTypes } = useWorkItemTypes();

    React.useEffect(() => {
        SDK.init({ applyTheme: true });
    }, []);

    return (
        <Page className="checklist-group flex-row flex-start flex-grow">
            {!workItemTypes && <Loading />}
            {workItemTypes && <ChecklistSettingsView workItemTypes={workItemTypes} />}
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
