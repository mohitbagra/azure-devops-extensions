import { Button } from "azure-devops-ui/Button";
import { ContentSize } from "azure-devops-ui/Callout";
import { IdentityPickerDropdown, IIdentity, IPeoplePickerProvider } from "azure-devops-ui/IdentityPicker";
import { Panel } from "azure-devops-ui/Panel";
import { PeoplePickerProvider } from "Common/ServiceWrappers/IdentityService";
import * as React from "react";

interface ISecurityPanelProps {
    onDismiss: () => void;
}

export function SecurityPanel(props: ISecurityPanelProps) {
    const pickerProvider = React.useRef<IPeoplePickerProvider>(new PeoplePickerProvider());

    return (
        <Panel blurDismiss={false} size={ContentSize.Medium} titleProps={{ text: "Security" }} onDismiss={props.onDismiss}>
            <div className="security-panel flex-column flex-grow">
                <IdentityPickerDropdown
                    pickerProvider={pickerProvider.current}
                    onChange={(identity?: IIdentity) => {
                        console.log(identity ? identity.displayName : "Empty");
                    }}
                    value={undefined}
                />
                <Button primary={true} className="save-button">
                    Save
                </Button>
            </div>
        </Panel>
    );
}
