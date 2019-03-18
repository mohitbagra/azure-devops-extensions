import "./BugBashEditor.scss";

import { WebApiTeam } from "azure-devops-extension-api/Core";
import { FieldType, WorkItemField, WorkItemTemplate, WorkItemType } from "azure-devops-extension-api/WorkItemTracking";
import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { CustomHeader, HeaderTitleArea } from "azure-devops-ui/Header";
import { CustomPanel, Panel, PanelCloseButton, PanelContent, PanelFooter } from "azure-devops-ui/Panel";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { ZeroData } from "azure-devops-ui/ZeroData";
import { Resources } from "BugBashPro/Resources";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { WorkItemFieldPicker } from "Common/AzDev/Fields/Components/WorkItemFieldPicker";
import { IFieldAwareState } from "Common/AzDev/Fields/Redux/Contracts";
import { TeamPicker } from "Common/AzDev/Teams/Components/TeamPicker";
import { ITeamAwareState } from "Common/AzDev/Teams/Redux/Contracts";
import { WorkItemTemplatePicker } from "Common/AzDev/WorkItemTemplates/Components";
import { IWorkItemTemplateAwareState } from "Common/AzDev/WorkItemTemplates/Redux/Contracts";
import { WorkItemTypePicker } from "Common/AzDev/WorkItemTypes/Components/WorkItemTypePicker";
import { IWorkItemTypeAwareState } from "Common/AzDev/WorkItemTypes/Redux/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { InfoLabel } from "Common/Components/InfoLabel";
import { Loading } from "Common/Components/Loading";
import { Mousetrapped } from "Common/Components/Mousetrapped";
import { DateTimePickerDropdown } from "Common/Components/Pickers/DateTimePickerDropdown";
import { TextField } from "Common/Components/TextField";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useThrottle } from "Common/Hooks/useThrottle";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { FadeAwayNotification } from "Common/Notifications/Components/FadeAwayNotification";
import { confirmAction } from "Common/ServiceWrappers/HostPageLayoutService";
import { defaultDateComparer } from "Common/Utilities/Date";
import * as React from "react";
import { BugBashEditorErrorKey, BugBashEditorNotificationKey, TitleFieldMaxLength } from "../Constants";
import {
    BugBashEditorActions,
    getBugBashEditorModule,
    getDraftBugBash,
    getDraftInitializeError,
    IBugBashEditorAwareState,
    isDraftDirty,
    isDraftSaving,
    isDraftValid
} from "../Redux/Draft";

interface IBugBashEditorPanelOwnProps {
    bugBashId?: string;
    onDismiss: () => void;
}

interface IBugBashEditorPanelStateProps {
    draftBugBash?: IBugBash;
    draftInitializeError?: string;
    isValid: boolean;
    isDirty: boolean;
    isSaving: boolean;
}

const Actions = {
    requestDraftSave: BugBashEditorActions.requestDraftSave,
    updateDraft: BugBashEditorActions.updateDraft,
    requestDraftInitialize: BugBashEditorActions.requestDraftInitialize
};

function BugBashEditorPanelInternal(props: IBugBashEditorPanelOwnProps) {
    const { onDismiss, bugBashId } = props;
    const mapStateToProps = React.useCallback(
        (
            state: IBugBashEditorAwareState & ITeamAwareState & IFieldAwareState & IWorkItemTypeAwareState & IWorkItemTemplateAwareState
        ): IBugBashEditorPanelStateProps => {
            return {
                draftBugBash: getDraftBugBash(state, bugBashId),
                draftInitializeError: getDraftInitializeError(state, bugBashId),
                isValid: isDraftValid(state, bugBashId),
                isDirty: isDraftDirty(state, bugBashId),
                isSaving: isDraftSaving(state, bugBashId)
            };
        },
        [bugBashId]
    );
    const { draftBugBash, isValid, isDirty, isSaving, draftInitializeError } = useMappedState(mapStateToProps);
    const { requestDraftSave, updateDraft, requestDraftInitialize } = useActionCreators(Actions);

    const throttledOnDraftChanged = useThrottle(updateDraft, 200);
    React.useEffect(() => {
        if (!draftBugBash) {
            requestDraftInitialize(bugBashId, true);
        }
    }, [bugBashId]);

    const dismissPanel = () => {
        if (isDirty) {
            confirmAction(Resources.ConfirmPanelTitle, Resources.ConfirmPanelClose_Content, (ok: boolean) => {
                if (ok) {
                    onDismiss();
                }
            });
        } else {
            onDismiss();
        }
    };

    if (!draftBugBash) {
        return (
            <Panel blurDismiss={false} className="bugbash-editor-panel" size={ContentSize.Large} onDismiss={dismissPanel}>
                {draftInitializeError && (
                    <ZeroData
                        className="flex-grow"
                        imagePath="../images/servererror.png"
                        imageAltText=""
                        primaryText="Can not load bug bash"
                        secondaryText={draftInitializeError}
                    />
                )}
                {!draftInitializeError && <Loading />}
            </Panel>
        );
    }
    const panelTitle = bugBashId ? Resources.EditBugBashPanelTitle : Resources.CreateBugBashPanelTitle;

    const updateTitle = (value: string) => {
        throttledOnDraftChanged({ ...draftBugBash, title: value });
    };
    const onStartTimeChange = (value: Date) => updateDraft({ ...draftBugBash, startTime: value || undefined });
    const onEndTimeChange = (value: Date) => updateDraft({ ...draftBugBash, endTime: value || undefined });
    const onAutoAcceptChange = (_event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, checked: boolean) =>
        updateDraft({ ...draftBugBash, autoAccept: checked });
    const onWorkItemTypeChange = (option: WorkItemType, value?: string) =>
        updateDraft({ ...draftBugBash, workItemType: option ? option.name : value || "", itemDescriptionField: "" });
    const onDescriptionFieldChange = (option: WorkItemField, value?: string) =>
        updateDraft({ ...draftBugBash, itemDescriptionField: option ? option.referenceName : value || "" });
    const onDefaultTeamChange = (option: WebApiTeam, value?: string) =>
        updateDraft({ ...draftBugBash, defaultTeam: option ? option.id : value || "" });
    const onTemplateTeamChange = (option: WebApiTeam, value?: string) =>
        updateDraft({ ...draftBugBash, acceptTemplateTeam: option ? option.id : value || "", acceptTemplateId: undefined });
    const onTemplateChange = (option: WorkItemTemplate, value?: string) =>
        updateDraft({ ...draftBugBash, acceptTemplateId: option ? option.id : value || "" });

    const saveBugBash = () => {
        requestDraftSave(bugBashId);
    };

    const getDatesError = () => {
        const { startTime, endTime } = draftBugBash;
        if (startTime && endTime && defaultDateComparer(startTime, endTime) >= 0) {
            return Resources.BugBashWrongDatesError;
        }
        return undefined;
    };

    return (
        <Mousetrapped
            shortcuts={[
                {
                    combos: ["ctrl+s", "meta+s"],
                    action: saveBugBash,
                    preventDefault: true
                }
            ]}
        >
            <CustomPanel
                blurDismiss={false}
                className="bugbash-editor-panel"
                size={ContentSize.Large}
                onDismiss={dismissPanel}
                defaultActiveElement=".bugbash-title-input"
            >
                <CustomHeader className="bugbash-editor-panel--header" separator={true}>
                    <HeaderTitleArea>
                        <div className="bugbash-editor-panel--header-title flex-row flex-center">
                            <div className="flex-grow fontSizeL">{panelTitle}</div>
                            <PanelCloseButton className="bugbash-editor-panel--closeButton" onDismiss={dismissPanel} />
                        </div>
                        <TextField
                            autoFocus={true}
                            disabled={isSaving}
                            placeholder="Enter Title"
                            className="bugbash-title-input"
                            onChange={updateTitle}
                            required={true}
                            value={draftBugBash.title}
                            maxLength={TitleFieldMaxLength}
                        />
                        <ErrorMessageBox className="bugbash-edit-error" errorKey={BugBashEditorErrorKey} />
                    </HeaderTitleArea>
                </CustomHeader>
                <PanelContent>
                    <div className="bugbash-editor-panel-contents flex-grow flex-column scroll-auto">
                        <div className="section-row flex-row flex-noshrink">
                            <DateTimePickerDropdown
                                className="bugbash-control"
                                placeholder="Select Start Time"
                                value={draftBugBash.startTime}
                                disableInput={true}
                                disabled={isSaving}
                                onChange={onStartTimeChange}
                                label={Resources.StartTime_Label}
                                getErrorMessage={getDatesError}
                            />
                            <DateTimePickerDropdown
                                className="bugbash-control"
                                placeholder="Select Finish Time"
                                disableInput={true}
                                disabled={isSaving}
                                value={draftBugBash.endTime}
                                onChange={onEndTimeChange}
                                label={Resources.EndTime_Label}
                            />
                        </div>
                        <div className="section-row flex-row flex-noshrink">
                            <WorkItemTypePicker
                                className="bugbash-control"
                                selectedValue={draftBugBash.workItemType || ""}
                                onChange={onWorkItemTypeChange}
                                disabled={isSaving}
                                label={Resources.WorkItemType_Label}
                                info={Resources.WorkItemType_LabelInfo}
                                required={true}
                            />
                            <WorkItemFieldPicker
                                className="bugbash-control"
                                workItemType={draftBugBash.workItemType}
                                allowedFieldTypes={[FieldType.Html]}
                                selectedValue={draftBugBash.itemDescriptionField || ""}
                                onChange={onDescriptionFieldChange}
                                disabled={isSaving}
                                label={Resources.DescriptionField_Label}
                                info={Resources.DescriptionField_LabelInfo}
                                required={true}
                            />
                        </div>
                        <div className="section-row flex-row flex-noshrink">
                            <TeamPicker
                                className="bugbash-control"
                                selectedValue={draftBugBash.acceptTemplateTeam || ""}
                                onChange={onTemplateTeamChange}
                                disabled={isSaving}
                                label={Resources.TemplateTeam_Label}
                                info={Resources.TemplateTeam_LabelInfo}
                            />
                            <WorkItemTemplatePicker
                                className="bugbash-control"
                                workItemType={draftBugBash.workItemType}
                                teamId={draftBugBash.acceptTemplateTeam}
                                selectedValue={draftBugBash.acceptTemplateId}
                                onChange={onTemplateChange}
                                disabled={isSaving}
                                label={Resources.Template_Label}
                                info={Resources.Template_LabelInfo}
                            />
                        </div>
                        <div className="section-row flex-row flex-noshrink">
                            <TeamPicker
                                className="bugbash-control"
                                selectedValue={draftBugBash.defaultTeam || ""}
                                onChange={onDefaultTeamChange}
                                label={Resources.DefaultTeam_Label}
                                disabled={isSaving}
                                info={Resources.DefaultTeam_LabelInfo}
                            />
                            <div className="bugbash-control flex-row flex-center">
                                <Checkbox
                                    className="auto-accept"
                                    disabled={isSaving}
                                    label=""
                                    checked={draftBugBash.autoAccept}
                                    onChange={onAutoAcceptChange}
                                />
                                <InfoLabel label="Auto Accept?" info={Resources.AutoAccept_LabelInfo} />
                            </div>
                        </div>
                    </div>
                </PanelContent>
                <PanelFooter showSeparator={true}>
                    <div className="footer-buttons flex-row justify-end">
                        <FadeAwayNotification duration={3000} notificationKey={BugBashEditorNotificationKey}>
                            {(notification: string) => <Status {...Statuses.Success} text={notification} size={StatusSize.xl} animated={false} />}
                        </FadeAwayNotification>
                        <Button className="footer-button" onClick={dismissPanel}>
                            Cancel
                        </Button>
                        <Button className="footer-button" primary={true} onClick={saveBugBash} disabled={!isValid || !isDirty || isSaving}>
                            Save
                        </Button>
                    </div>
                </PanelFooter>
            </CustomPanel>
        </Mousetrapped>
    );
}

export function BugBashEditorPanel(props: IBugBashEditorPanelOwnProps) {
    return (
        <DynamicModuleLoader modules={[getBugBashEditorModule()]} cleanOnUnmount={true}>
            <BugBashEditorPanelInternal {...props} />
        </DynamicModuleLoader>
    );
}
