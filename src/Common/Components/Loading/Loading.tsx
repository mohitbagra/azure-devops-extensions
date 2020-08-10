import "./Loading.scss";

import * as React from "react";

import { Spinner, SpinnerSize } from "OfficeFabric/Spinner";

export function Loading() {
    return (
        <div className="content-loading flex-row flex-center justify-center">
            <Spinner className="loading-spinner" size={SpinnerSize.large} />
        </div>
    );
}
