import { IBugBashItemProviderParams, IBugBashViewBaseProps } from "BugBashPro/Hubs/BugBashView/Interfaces";
import * as React from "react";

export function BugBashItemsBoard(props: IBugBashViewBaseProps & IBugBashItemProviderParams) {
    const { bugBash } = props;
    return <>{`Board: ${bugBash.id}`}</>;
}
