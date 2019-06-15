import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { WorkItemFormListener } from "Common/AzDev/WorkItemForm/Components/WorkItemFormListener";
import { ReduxHooksStoreProvider } from "Common/Redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { RelatedWitsContext } from "../Constants";
import { getRelatedWitsModule } from "../Redux/Module";
import { RelatedWits } from "./RelatedWits";

function App() {
    return (
        <WorkItemFormListener>
            {(activeWorkItemId: number, isNew: boolean) => {
                if (isNew) {
                    return (
                        <MessageCard className="related-wits-message" severity={MessageCardSeverity.Info}>
                            Please save the work item to see related work items.
                        </MessageCard>
                    );
                } else {
                    return (
                        <RelatedWitsContext.Provider value={activeWorkItemId}>
                            <RelatedWits />
                        </RelatedWitsContext.Provider>
                    );
                }
            }}
        </WorkItemFormListener>
    );
}

const store = createStore({}, [], [getSagaExtension()], getRelatedWitsModule());

ReactDOM.render(
    <ReduxHooksStoreProvider value={store}>
        <App />
    </ReduxHooksStoreProvider>,
    document.getElementById("ext-container")
);
