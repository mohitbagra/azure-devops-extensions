import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { Panel } from "azure-devops-ui/Panel";
import { BugBashRichEditor } from "BugBashPro/Shared/Components/BugBashRichEditor";
import { useBugBashDetails } from "BugBashPro/Shared/Hooks/useBugBashDetails";
import { getBugBashDetailsModule } from "BugBashPro/Shared/Redux/BugBashDetails/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useThrottle } from "Common/Hooks/useThrottle";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import * as React from "react";
import { BugBashDetailsEditorErrorKey } from "../Constants";

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

    const onImageUploadError = React.useCallback((error: string) => {
        pushError(BugBashDetailsEditorErrorKey, error);
    }, []);

    return (
        <Panel onDismiss={onDismiss} size={ContentSize.Large} titleProps={{ text: "Bug bash details" }}>
            {isLoading && <Loading />}
            {!isLoading && (
                <div className="bugbash-details-editor-contents">
                    <ErrorMessageBox className="bugbash-details-editor-error" errorKey={BugBashDetailsEditorErrorKey} />
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
        </Panel>
    );
}

export function BugBashDetailsEditorPanel(props: IBugBashDetailsEditorPanelOwnProps) {
    return (
        <DynamicModuleLoader modules={[getBugBashDetailsModule()]} cleanOnUnmount={true}>
            <BugBashDetailsEditorPanelInternal {...props} />
        </DynamicModuleLoader>
    );
}
