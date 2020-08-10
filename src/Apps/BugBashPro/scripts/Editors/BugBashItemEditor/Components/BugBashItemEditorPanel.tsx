import "./BugBashItemEditor.scss";

import * as React from "react";

import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { CustomHeader, HeaderTitleArea } from "azure-devops-ui/Header";
import { CustomPanel, Panel, PanelCloseButton, PanelContent, PanelFooter } from "azure-devops-ui/Panel";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { ZeroData } from "azure-devops-ui/ZeroData";
import { Resources } from "BugBashPro/Resources";
import { BugBashRichEditor } from "BugBashPro/Shared/Components/BugBashRichEditor";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { useBugBash } from "BugBashPro/Shared/Hooks/useBugBash";
import { getCommentsModule } from "BugBashPro/Shared/Redux/Comments/Module";
import { getTeamFieldModule } from "Common/AzDev/TeamFields/Redux/Module";
import { TeamPicker } from "Common/AzDev/Teams/Components/TeamPicker";
import { ITeamAwareState } from "Common/AzDev/Teams/Redux/Contracts";
import { getWorkItemTemplateModule } from "Common/AzDev/WorkItemTemplates/Redux/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { Mousetrapped } from "Common/Components/Mousetrapped";
import { TextField } from "Common/Components/TextField";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useThrottle } from "Common/Hooks/useThrottle";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { FadeAwayNotification } from "Common/Notifications/Components/FadeAwayNotification";
import { KeyValuePairActions } from "Common/Notifications/Redux/Actions";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";
import { getCurrentUser } from "Common/Utilities/Identity";
import { isNullOrWhiteSpace } from "Common/Utilities/String";

import { BugBashItemEditorErrorKey, BugBashItemEditorNotificationKey, TitleFieldMaxLength } from "../Constants";
import { BugBashItemEditorActions } from "../Redux/Actions";
import { IBugBashItemEditorAwareState } from "../Redux/Contracts";
import { getBugBashItemEditorModule } from "../Redux/Module";
import { getDraftBugBashItem, getDraftComment, getDraftInitializeError, isDraftDirty, isDraftSaving, isDraftValid } from "../Redux/Selectors";
import { CommentsList } from "./CommentsList";

interface IBugBashItemEditorPanelOwnProps {
    bugBashId: string;
    bugBashItemId?: string;
    readFromCache: boolean;
    onDismiss: () => void;
}

interface IBugBashItemEditorPanelStateProps {
    draftBugBashItem?: IBugBashItem;
    draftComment?: string;
    draftInitializeError?: string;
    isValid: boolean;
    isDirty: boolean;
    isSaving: boolean;
}

const Actions = {
    requestDraftSave: BugBashItemEditorActions.requestDraftSave,
    updateDraft: BugBashItemEditorActions.updateDraft,
    updateDraftComment: BugBashItemEditorActions.updateDraftComment,
    requestDraftInitialize: BugBashItemEditorActions.requestDraftInitialize,
    requestDraftAccept: BugBashItemEditorActions.requestDraftAccept,
    pushError: KeyValuePairActions.pushEntry
};

function BugBashItemEditorPanelInternal(props: IBugBashItemEditorPanelOwnProps) {
    const { onDismiss, bugBashItemId, bugBashId, readFromCache } = props;
    const mapState = React.useCallback(
        (state: IBugBashItemEditorAwareState & ITeamAwareState): IBugBashItemEditorPanelStateProps => {
            return {
                draftBugBashItem: getDraftBugBashItem(state, bugBashItemId),
                draftComment: getDraftComment(state, bugBashItemId),
                draftInitializeError: getDraftInitializeError(state, bugBashItemId),
                isValid: isDraftValid(state, bugBashItemId),
                isDirty: isDraftDirty(state, bugBashItemId),
                isSaving: isDraftSaving(state, bugBashItemId)
            };
        },
        [bugBashItemId]
    );
    const { draftBugBashItem, isValid, isDirty, draftComment, isSaving, draftInitializeError } = useMappedState(mapState);
    const { requestDraftSave, updateDraft, updateDraftComment, requestDraftInitialize, requestDraftAccept, pushError } = useActionCreators(Actions);
    const { bugBash } = useBugBash(bugBashId);

    if (!bugBash) {
        throw new Error(`BugBash ${bugBashId} has not been loaded yet`);
    }

    const throttledOnDraftChanged = useThrottle(updateDraft, 200);
    const throttledOnDraftCommentChanged = useThrottle(updateDraftComment, 200);

    React.useEffect(() => {
        if (!draftBugBashItem) {
            requestDraftInitialize(bugBash, bugBashItemId, readFromCache);
        }
    }, [bugBashItemId]);

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
        pushError(BugBashItemEditorErrorKey, error);
    }, []);
    const saveBugBashItem = React.useCallback(() => {
        requestDraftSave(bugBash, bugBashItemId);
    }, [bugBash, bugBashItemId]);
    const acceptBugBashItem = React.useCallback(() => {
        requestDraftAccept(bugBash, bugBashItemId);
    }, [bugBash, bugBashItemId]);

    if (!draftBugBashItem) {
        return (
            <Panel blurDismiss={false} className="bugbash-item-editor-panel" size={ContentSize.Large} onDismiss={dismissPanel}>
                {draftInitializeError && (
                    <ZeroData
                        className="flex-grow"
                        imagePath="../images/servererror.png"
                        imageAltText=""
                        primaryText="Can not load bug bash item"
                        secondaryText={draftInitializeError}
                    />
                )}
                {!draftInitializeError && <Loading />}
            </Panel>
        );
    } else if (isBugBashItemAccepted(draftBugBashItem)) {
        return (
            <Panel blurDismiss={false} className="bugbash-item-editor-panel" size={ContentSize.Large} onDismiss={dismissPanel}>
                <div>This work item is accepted</div>
            </Panel>
        );
    }

    const panelTitle = bugBashItemId ? Resources.EditBugBashItemPanelTitle : Resources.CreateBugBashItemPanelTitle;
    const isNew = isNullOrWhiteSpace(bugBashItemId);

    const onTitleChange = (value: string) => {
        throttledOnDraftChanged({ ...draftBugBashItem, title: value });
    };
    const onRejectChange = (_: unknown, checked?: boolean) =>
        updateDraft({ ...draftBugBashItem, rejected: checked, rejectReason: "", rejectedBy: checked ? getCurrentUser() : undefined });
    const onRejectReasonChange = (value: string) => {
        throttledOnDraftChanged({ ...draftBugBashItem, rejectReason: value });
    };
    const onDescriptionChange = (value: string) => {
        throttledOnDraftChanged({ ...draftBugBashItem, description: value });
    };
    const onAssignedToTeamChange = (option: WebApiTeam, value?: string) =>
        updateDraft({ ...draftBugBashItem, teamId: option ? option.id : value || "" });
    const onCommentChange = (value: string) => {
        throttledOnDraftCommentChanged(bugBashItemId, value);
    };

    return (
        <Mousetrapped
            shortcuts={[
                {
                    combos: ["ctrl+s", "meta+s"],
                    action: saveBugBashItem,
                    preventDefault: true
                }
            ]}
        >
            <CustomPanel
                blurDismiss={false}
                className="bugbash-item-editor-panel"
                size={ContentSize.Large}
                onDismiss={dismissPanel}
                defaultActiveElement=".bugbash-item-title-input"
            >
                <CustomHeader className="bugbash-item-editor-panel--header" separator={true}>
                    <HeaderTitleArea>
                        <div className="bugbash-item-editor-panel--header-title flex-row flex-center">
                            <div className="flex-grow font-size-l">{panelTitle}</div>

                            <ConditionalChildren renderChildren={bugBash.autoAccept}>
                                <Status className="header-button" {...Statuses.Success} text="Auto accept on" size={StatusSize.l} animated={false} />
                            </ConditionalChildren>
                            <ConditionalChildren renderChildren={!isNew && !bugBash.autoAccept}>
                                <Button
                                    className="header-button"
                                    disabled={!isValid || isDirty || isSaving}
                                    onClick={acceptBugBashItem}
                                    iconProps={{ iconName: "Accept", className: "success-text" }}
                                >
                                    Accept
                                </Button>
                            </ConditionalChildren>
                            <ConditionalChildren renderChildren={!isNew && !bugBash.autoAccept}>
                                <Checkbox
                                    className="header-button"
                                    label="Rejected"
                                    disabled={isSaving}
                                    checked={draftBugBashItem.rejected || false}
                                    onChange={onRejectChange}
                                />
                            </ConditionalChildren>

                            <PanelCloseButton className="bugbash-item-editor-panel--closeButton" onDismiss={dismissPanel} />
                        </div>
                        <TextField
                            autoFocus={true}
                            placeholder="Enter Title"
                            className="bugbash-item-title-input"
                            multiline={true}
                            onChange={onTitleChange}
                            required={true}
                            value={draftBugBashItem.title}
                            disabled={isSaving}
                            maxLength={TitleFieldMaxLength}
                        />
                        <ErrorMessageBox className="bugbash-item-edit-error" errorKey={BugBashItemEditorErrorKey} />
                    </HeaderTitleArea>
                </CustomHeader>
                <PanelContent>
                    <div className="bugbash-item-editor-panel-contents flex-grow flex-column scroll-auto">
                        <TeamPicker
                            className="bugbash-item-control"
                            selectedValue={draftBugBashItem.teamId || ""}
                            onChange={onAssignedToTeamChange}
                            required={true}
                            disabled={isSaving}
                            label="Assigned to team"
                            info="Select a team to assign this bug bash item to"
                        />
                        <ConditionalChildren renderChildren={!isNew && draftBugBashItem.rejected}>
                            <TextField
                                className="bugbash-item-control"
                                placeholder="Enter reject reason"
                                label="Reject reason"
                                info={`Rejected by ${draftBugBashItem.rejectedBy ? draftBugBashItem.rejectedBy.displayName : ""}`}
                                disabled={isSaving}
                                onChange={onRejectReasonChange}
                                value={draftBugBashItem.rejectReason || ""}
                                maxLength={TitleFieldMaxLength}
                            />
                        </ConditionalChildren>
                        <BugBashRichEditor
                            bugBashId={draftBugBashItem.bugBashId}
                            className="bugbash-item-control"
                            label="Description"
                            disabled={isSaving}
                            value={draftBugBashItem.description || ""}
                            onChange={onDescriptionChange}
                            onImageUploadError={onImageUploadError}
                        />
                        <BugBashRichEditor
                            bugBashId={draftBugBashItem.bugBashId}
                            className="bugbash-item-control"
                            label="Discussion"
                            disabled={isSaving}
                            value={draftComment || ""}
                            onChange={onCommentChange}
                            onImageUploadError={onImageUploadError}
                        />
                        <ConditionalChildren renderChildren={!isNew}>
                            <CommentsList bugBashItemId={bugBashItemId!} />
                        </ConditionalChildren>
                    </div>
                </PanelContent>
                <PanelFooter showSeparator={true}>
                    <div className="footer-buttons flex-row justify-end">
                        <FadeAwayNotification duration={3000} notificationKey={BugBashItemEditorNotificationKey}>
                            {(notification: string) => <Status {...Statuses.Success} text={notification} size={StatusSize.xl} animated={false} />}
                        </FadeAwayNotification>
                        <Button className="footer-button" onClick={dismissPanel}>
                            Cancel
                        </Button>
                        <Button className="footer-button" primary={true} onClick={saveBugBashItem} disabled={!isValid || !isDirty || isSaving}>
                            Save
                        </Button>
                    </div>
                </PanelFooter>
            </CustomPanel>
        </Mousetrapped>
    );
}

export function BugBashItemEditorPanel(props: IBugBashItemEditorPanelOwnProps) {
    return (
        <DynamicModuleLoader modules={[getBugBashItemEditorModule(), getCommentsModule()]} cleanOnUnmount={true}>
            <DynamicModuleLoader modules={[getTeamFieldModule(), getWorkItemTemplateModule()]}>
                <BugBashItemEditorPanelInternal {...props} />
            </DynamicModuleLoader>
        </DynamicModuleLoader>
    );
}
