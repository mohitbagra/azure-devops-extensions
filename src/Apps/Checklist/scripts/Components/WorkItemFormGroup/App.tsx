import "../Root.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { ReduxHooksStoreProvider } from "Common/Redux";
import { createStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";

import { ChecklistGroup } from "./ChecklistGroup";

const store = createStore({}, [], [getSagaExtension()]);

ReactDOM.render(
    <ReduxHooksStoreProvider value={store}>
        <ChecklistGroup />
    </ReduxHooksStoreProvider>,
    document.getElementById("ext-container")
);
