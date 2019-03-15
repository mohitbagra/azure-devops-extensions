import "./Loading.scss";

import { Spinner, SpinnerSize } from "OfficeFabric/Spinner";
import * as React from "react";

export function Loading() {
    return (
        <div className="content-loading flex-row flex-center justify-center">
            <Spinner className="loading-spinner" size={SpinnerSize.large} />
        </div>
    );
}
