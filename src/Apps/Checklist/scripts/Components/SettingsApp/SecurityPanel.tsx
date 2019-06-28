import { Button } from "azure-devops-ui/Button";
import { ContentSize } from "azure-devops-ui/Callout";
import { IdentityPickerDropdown, IIdentity, IPeoplePickerProvider } from "azure-devops-ui/IdentityPicker";
import { Panel } from "azure-devops-ui/Panel";
import { PeoplePickerProvider } from "Common/ServiceWrappers/IdentityService";
import * as React from "react";

interface ISecurityPanelProps {
    adminGroup?: IIdentity;
    onDismiss: () => void;
}

export function SecurityPanel(props: ISecurityPanelProps) {
    const { adminGroup, onDismiss } = props;
    const pickerProvider = React.useRef<IPeoplePickerProvider>(new PeoplePickerProvider(["group"]));
    const [adminGroupState, setAdminGroupState] = React.useState(adminGroup);

    return (
        <Panel blurDismiss={false} size={ContentSize.Medium} titleProps={{ text: "Security" }} onDismiss={onDismiss}>
            <div className="security-panel flex-column flex-grow">
                <IdentityPickerDropdown
                    pickerProvider={pickerProvider.current}
                    onChange={(identity?: IIdentity) => {
                        setAdminGroupState(identity);
                    }}
                    value={adminGroupState}
                />
                <Button primary={true} className="save-button">
                    Save
                </Button>
            </div>
        </Panel>
    );
}
