import * as React from "react";
import { IBugBashItemProviderParams, IBugBashViewBaseProps } from "../../../Interfaces";

export function BugBashItemsBoard(props: IBugBashViewBaseProps & IBugBashItemProviderParams) {
    const { bugBash } = props;
    return <>{`Board: ${bugBash.id}`}</>;
}
