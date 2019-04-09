import { Panel } from "azure-devops-ui/Panel";
import * as React from "react";

interface IBugBashDetailsEditorPanelOwnProps {
    bugBashId: string;
    onDismiss: () => void;
}

export function BugBashDetailsEditorPanel(props: IBugBashDetailsEditorPanelOwnProps) {
    const { bugBashId, onDismiss } = props;
    return (
        <Panel onDismiss={onDismiss} titleProps={{ text: "Details" }}>
            <div>{`Details for ${bugBashId}`}</div>
        </Panel>
    );
}
