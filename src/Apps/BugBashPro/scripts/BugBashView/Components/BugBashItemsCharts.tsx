import * as React from "react";
import { IBugBashItemProviderParams, IBugBashViewBaseProps } from "../Interfaces";

export function BugBashItemsCharts(props: IBugBashViewBaseProps & IBugBashItemProviderParams) {
    const { bugBash } = props;
    return <>{`Charts: ${bugBash.id}`}</>;
}
