import "./WorkItemFieldValuePicker.scss";

import {
    FieldType, WorkItemField, WorkItemTypeFieldWithReferences
} from "azure-devops-extension-api/WorkItemTracking";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { equals } from "azure-devops-ui/Core/Util/String";
import { css } from "azure-devops-ui/Util";
import { AreaPathPicker } from "Common/Components/AzDev/ClassificationNodePickers/AreaPathPicker";
import {
    IterationPathPicker
} from "Common/Components/AzDev/ClassificationNodePickers/IterationPathPicker";
import { WorkItemTagPicker } from "Common/Components/AzDev/WorkItemTagPicker";
import { IInputComponentProps, ILabelledComponentProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { DateTimePickerDropdown } from "Common/Components/Pickers/DateTimePickerDropdown";
import { PicklistPicker } from "Common/Components/Pickers/PicklistPicker";
import { RichEditor } from "Common/Components/RichEditor";
import { TextField } from "Common/Components/TextField";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    FieldActions, getField, getFieldModule, getWorkItemTypeField, IFieldAwareState,
    WorkItemTypeFieldActions
} from "Common/Redux/Fields";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { Spinner, SpinnerSize } from "OfficeFabric/Spinner";
import * as React from "react";

interface IWorkItemFieldValuePickerOwnProps extends ILabelledComponentProps, IInputComponentProps<any> {
    fieldRefName: string;
    workItemTypeName: string;
}

interface IWorkItemFieldValuePickerStateProps {
    field?: WorkItemField;
    workItemTypeField?: WorkItemTypeFieldWithReferences;
}

const Actions = { loadFields: FieldActions.loadRequested, loadWorkItemTypeFields: WorkItemTypeFieldActions.loadRequested };

function WorkItemFieldValuePickerInternal(props: IWorkItemFieldValuePickerOwnProps) {
    const { fieldRefName, workItemTypeName, value, label, disabled, info, required, getErrorMessage, className, onChange } = props;
    const mapStateToProps = React.useCallback(
        (state: IFieldAwareState): IWorkItemFieldValuePickerStateProps => {
            return {
                field: getField(state, fieldRefName),
                workItemTypeField: getWorkItemTypeField(state, workItemTypeName, fieldRefName)
            };
        },
        [workItemTypeName, fieldRefName]
    );
    const { field, workItemTypeField } = useMappedState(mapStateToProps);
    const { loadFields, loadWorkItemTypeFields } = useActionCreators(Actions);

    const onCheckboxChanged = (_ev: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        onFieldValueChanged(checked ? "1" : "0");
    };
    const onComboValueChanged = (option: string, value: string) => {
        onFieldValueChanged(option || value);
    };
    const onTagsChanged = (tags: string[]) => {
        onFieldValueChanged(tags.join(";"));
    };
    const onFieldValueChanged = (value: any) => {
        if (onChange) {
            onChange(value);
        }
    };
    const convertToComboOption = (av: any) => ({ key: av.toString(), name: av.toString() });

    React.useEffect(() => {
        if (!field) {
            loadFields();
        }
        if (!workItemTypeField) {
            loadWorkItemTypeFields(workItemTypeName);
        }
    }, []);

    if (!field || !workItemTypeField) {
        return <Spinner size={SpinnerSize.large} />;
    }

    const cssClassName = css("field-value-picker", className);
    if (fieldRefName === "System.Tags") {
        return (
            <WorkItemTagPicker
                label={label}
                info={info}
                required={required}
                getErrorMessage={getErrorMessage}
                disabled={disabled}
                value={isNullOrWhiteSpace(value) ? [] : (value as string).split(";")}
                onChange={onTagsChanged}
            />
        );
    } else if (fieldRefName === "System.AreaPath") {
        return (
            <AreaPathPicker
                value={value as string}
                className={cssClassName}
                label={label}
                info={info}
                required={required}
                disabled={disabled}
                getErrorMessage={getErrorMessage}
                onChange={onFieldValueChanged}
            />
        );
    } else if (fieldRefName === "System.IterationPath") {
        return (
            <IterationPathPicker
                value={value as string}
                className={cssClassName}
                label={label}
                info={info}
                getErrorMessage={getErrorMessage}
                required={required}
                disabled={disabled}
                onChange={onFieldValueChanged}
            />
        );
    }

    switch (field.type) {
        case FieldType.Boolean:
            const checked = value === 1 || value === "1" || equals(value as string, "true", true) || (value as boolean) === true ? true : false;
            return <Checkbox className={cssClassName} checked={checked} onChange={onCheckboxChanged} disabled={disabled} />;
        case FieldType.PlainText:
            return (
                <TextField
                    className={cssClassName}
                    value={value as string}
                    multiline={true}
                    label={label}
                    info={info}
                    getErrorMessage={getErrorMessage}
                    required={required}
                    disabled={disabled}
                    onChange={onFieldValueChanged}
                />
            );
        case FieldType.History:
        case FieldType.Html:
            return (
                <RichEditor
                    className={cssClassName}
                    value={value as string}
                    label={label}
                    info={info}
                    disabled={disabled}
                    required={required}
                    getErrorMessage={getErrorMessage}
                    onChange={onFieldValueChanged}
                />
            );
        case FieldType.DateTime:
            return (
                <DateTimePickerDropdown
                    value={value}
                    className={cssClassName}
                    label={label}
                    info={info}
                    required={required}
                    disabled={disabled}
                    getErrorMessage={getErrorMessage}
                    onChange={onFieldValueChanged}
                />
            );
        default:
            if (workItemTypeField.allowedValues && workItemTypeField.allowedValues.length > 0) {
                return (
                    <PicklistPicker
                        options={workItemTypeField.allowedValues}
                        selectedValue={value as string}
                        className={cssClassName}
                        label={label}
                        info={info}
                        required={required}
                        disabled={disabled}
                        getErrorMessage={getErrorMessage}
                        onChange={onComboValueChanged}
                        getPicklistItem={convertToComboOption}
                    />
                );
            } else {
                return (
                    <TextField
                        className={cssClassName}
                        value={value as string}
                        label={label}
                        info={info}
                        required={required}
                        getErrorMessage={getErrorMessage}
                        disabled={disabled}
                        onChange={onFieldValueChanged}
                    />
                );
            }
    }
}

export function WorkItemFieldValuePicker(props: IWorkItemFieldValuePickerOwnProps) {
    return (
        <DynamicModuleLoader modules={[getFieldModule()]}>
            <WorkItemFieldValuePickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
