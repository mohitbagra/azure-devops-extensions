import * as React from "react";

interface IBugBashChartsOwnProps {
    bugBashId: string;
}

export function BugBashCharts(props: IBugBashChartsOwnProps) {
    const { bugBashId } = props;
    return <>{`Charts: ${bugBashId}`}</>;
}
