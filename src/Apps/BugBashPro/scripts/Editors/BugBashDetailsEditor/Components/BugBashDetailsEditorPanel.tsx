import { Button } from "azure-devops-ui/Button";
import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { CustomHeader, HeaderTitleArea } from "azure-devops-ui/Header";
import { CustomPanel, PanelCloseButton, PanelContent, PanelFooter } from "azure-devops-ui/Panel";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { Resources } from "BugBashPro/Resources";
import { BugBashRichEditor } from "BugBashPro/Shared/Components/BugBashRichEditor";
import { useBugBashDetails } from "BugBashPro/Shared/Hooks/useBugBashDetails";
import { getBugBashDetailsModule } from "BugBashPro/Shared/Redux/BugBashDetails/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useThrottle } from "Common/Hooks/useThrottle";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { FadeAwayNotification } from "Common/Notifications/Components/FadeAwayNotification";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";
import * as React from "react";
import { BugBashDetailsEditorErrorKey, BugBashDetailsEditorNotificationKey } from "../Constants";

interface IBugBashDetailsEditorPanelOwnProps {
    bugBashId: string;
    onDismiss: () => void;
}

const Actions = {
    pushError: KeyValuePairActions.pushEntry
};

function BugBashDetailsEditorPanelInternal(props: IBugBashDetailsEditorPanelOwnProps) {
    const { bugBashId, onDismiss } = props;
    const { details } = useBugBashDetails(bugBashId);
    const { pushError } = useActionCreators(Actions);

    const isLoading = !details;
    const detailsText = details && details.text;

    const updateDraft = React.useCallback((value: string) => {
        console.log(value);
    }, []);

    const throttledOnDraftChanged = useThrottle(updateDraft, 200);
    const [isDirty, setIsDirty] = React.useState(false);
    const [isValid, setIsValid] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

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
    const saveBugBashDetails = React.useCallback(() => {
        setIsDirty(false);
        setIsValid(true);
        setIsSaving(true);
    }, [bugBashId]);

    return (
        <CustomPanel blurDismiss={false} className="bugbash-details-editor-panel" size={ContentSize.Large} onDismiss={dismissPanel}>
            <CustomHeader className="bugbash-details-editor-panel--header" separator={true}>
                <HeaderTitleArea>
                    <div className="bugbash-details-editor-panel--header-title flex-row flex-center">
                        <div className="flex-grow fontSizeL">Bug Bash Details</div>
                        <PanelCloseButton className="bugbash-details-editor-panel--closeButton" onDismiss={dismissPanel} />
                    </div>
                    <ErrorMessageBox className="bugbash-details-editor-error" errorKey={BugBashDetailsEditorErrorKey} />
                </HeaderTitleArea>
            </CustomHeader>
            <PanelContent>
                {isLoading && <Loading />}
                {!isLoading && (
                    <div className="bugbash-details-editor-contents">
                        <BugBashRichEditor
                            bugBashId={bugBashId}
                            className="bugbash-details-editor-control"
                            disabled={false}
                            value={detailsText || ""}
                            onChange={throttledOnDraftChanged}
                            onImageUploadError={onImageUploadError}
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
                    <Button className="footer-button" primary={true} onClick={saveBugBashDetails} disabled={!isValid || !isDirty || isSaving}>
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
