import { ReduxHooksStoreProvider } from "Common/Redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux-dynamic-modules";
import { getSagaExtension } from "redux-dynamic-modules-saga";
import { RelatedWits } from "./RelatedWits";

const store = createStore({}, [], [getSagaExtension()]);

ReactDOM.render(
    <ReduxHooksStoreProvider value={store}>
        <RelatedWits />
    </ReduxHooksStoreProvider>,
    document.getElementById("ext-container")
);
