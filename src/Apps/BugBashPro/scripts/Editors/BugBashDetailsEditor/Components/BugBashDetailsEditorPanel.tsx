import "./BugBashDetailsEditorPanel.scss";

import * as React from "react";

import { Button } from "azure-devops-ui/Button";
import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { equals } from "azure-devops-ui/Core/Util/String";
import { CustomHeader, HeaderTitleArea } from "azure-devops-ui/Header";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { CustomPanel, PanelCloseButton, PanelContent, PanelFooter } from "azure-devops-ui/Panel";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { Resources } from "BugBashPro/Resources";
import { BugBashRichEditor } from "BugBashPro/Shared/Components/BugBashRichEditor";
import { useBugBashDetails } from "BugBashPro/Shared/Hooks/useBugBashDetails";
import { BugBashDetailActions } from "BugBashPro/Shared/Redux/BugBashDetails/Actions";
import { getBugBashDetailsModule } from "BugBashPro/Shared/Redux/BugBashDetails/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useControlledState } from "Common/Hooks/useControlledState";
import { useThrottle } from "Common/Hooks/useThrottle";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { FadeAwayNotification } from "Common/Notifications/Components/FadeAwayNotification";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";

import { BugBashDetailsEditorErrorKey, BugBashDetailsEditorNotificationKey } from "../Constants";

interface IBugBashDetailsEditorPanelOwnProps {
    bugBashId: string;
    onDismiss: () => void;
}

const Actions = {
    pushError: KeyValuePairActions.pushEntry,
    saveDetails: BugBashDetailActions.BugBashDetailsUpdateRequested
};

function BugBashDetailsEditorPanelInternal(props: IBugBashDetailsEditorPanelOwnProps) {
    const { bugBashId, onDismiss } = props;
    const { details, status, error } = useBugBashDetails(bugBashId);
    const { pushError, saveDetails } = useActionCreators(Actions);

    const [value, setValue] = useControlledState<string>(details ? details.text : "");
    const throttledOnDraftChanged = useThrottle(setValue, 200);

    const isLoading = !details;
    const isDirty = !equals((details && details.text) || "", value, true);

    const dismissPanel = React.useCallback(() => {
        if (isDirty) {
            confirmAction(Resources.ConfirmPanelTitle, Resources.ConfirmPanelClose_Content, (ok: boolean) => {
                if (ok) {
                    onDismiss();
                }
            });
        } else {
            onDismiss();
        }
    }, [isDirty, onDismiss]);

    const onImageUploadError = React.useCallback((error: string) => {
        pushError(BugBashDetailsEditorErrorKey, error);
    }, []);

    const saveBugBashDetails = () => {
        if (isDirty && status === LoadStatus.Ready) {
            saveDetails(bugBashId, { ...details, text: value });
        }
    };

    return (
        <CustomPanel blurDismiss={false} className="bugbash-details-editor-panel" size={ContentSize.Large} onDismiss={dismissPanel}>
            <CustomHeader className="bugbash-details-editor-panel--header" separator={true}>
                <HeaderTitleArea>
                    <div className="bugbash-details-editor-panel--header-title flex-row flex-center">
                        <div className="flex-grow font-size-l">Bug Bash Details</div>
                        <PanelCloseButton className="bugbash-details-editor-panel--closeButton" onDismiss={dismissPanel} />
                    </div>
                    <ErrorMessageBox className="bugbash-details-editor-error" errorKey={BugBashDetailsEditorErrorKey} />
                    {error && (
                        <MessageCard className="error-message" severity={MessageCardSeverity.Error}>
                            {error}
                        </MessageCard>
                    )}
                </HeaderTitleArea>
            </CustomHeader>
            <PanelContent>
                {isLoading && <Loading />}
                {!isLoading && (
                    <div className="bugbash-details-editor-panel-contents flex-grow flex-column scroll-auto">
                        <BugBashRichEditor
                            autoFocus={true}
                            bugBashId={bugBashId}
                            className="bugbash-details-editor-control flex-grow"
                            disabled={status !== LoadStatus.Ready}
                            value={value}
                            onChange={throttledOnDraftChanged}
                            onImageUploadError={onImageUploadError}
                            placeholder="Enter bug bash details"
                            height="100%"
                        />
                    </div>
                )}
            </PanelContent>
            <PanelFooter showSeparator={true}>
                <div className="footer-buttons flex-row justify-end">
                    <FadeAwayNotification duration={3000} notificationKey={BugBashDetailsEditorNotificationKey}>
                        {(notification: string) => <Status {...Statuses.Success} text={notification} size={StatusSize.xl} animated={false} />}
                    </FadeAwayNotification>
                    <Button className="footer-button" onClick={dismissPanel}>
                        Cancel
                    </Button>
                    <Button className="footer-button" primary={true} onClick={saveBugBashDetails} disabled={!isDirty || status !== LoadStatus.Ready}>
                        Save
                    </Button>
                </div>
            </PanelFooter>
        </CustomPanel>
    );
}

export function BugBashDetailsEditorPanel(props: IBugBashDetailsEditorPanelOwnProps) {
    return (
        <DynamicModuleLoader modules={[getBugBashDetailsModule()]} cleanOnUnmount={true}>
            <BugBashDetailsEditorPanelInternal {...props} />
        </DynamicModuleLoader>
    );
}
