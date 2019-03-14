import * as React from "react";
import * as ReactDOM from "react-dom";
import { RootComponent } from "BugBashPro/Root/Components/RootComponent";
import { ReduxHooksStoreProvider } from "Common/Redux";
import { createStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";

const store = createStore({}, [], [getSagaExtension()]);

ReactDOM.render(
    <ReduxHooksStoreProvider value={store}>
        <RootComponent />
    </ReduxHooksStoreProvider>,
    document.getElementById("ext-container")
);
