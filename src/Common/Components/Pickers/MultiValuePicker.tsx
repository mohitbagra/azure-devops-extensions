import "./MultiValuePicker.scss";

import { equals } from "azure-devops-ui/Core/Util/String";
import { EditableLabelGroup, ILabelModel, LabelGroup, WrappingBehavior } from "azure-devops-ui/Label";
import { css } from "azure-devops-ui/Util";
import { IInputComponentProps, ILabelledComponentProps } from "Common/Components/Contracts";
import { LabelledComponent } from "Common/Components/LabelledComponent";
import { useControlledState } from "Common/Hooks/useControlledState";
import { contains, findIndex } from "Common/Utilities/Array";
import { ignoreCaseEquals, isNullOrWhiteSpace } from "Common/Utilities/String";
import * as React from "react";

export interface IMultiValuePickerProps extends ILabelledComponentProps, IInputComponentProps<string[]> {
    allValues?: string[];
    addButtonText?: string;
}

export function MultiValuePicker(props: IMultiValuePickerProps) {
    const { allValues, addButtonText, label, info, placeholder, disabled, className, required, getErrorMessage, onChange, value: prop_value } = props;
    const [value, setValue] = useControlledState(prop_value);
    const onValuesChanged = (newValue: string[]) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };
    const onLabelSubmit = (labelModel: ILabelModel) => {
        const arr = value || [];
        const valueToAdd = labelModel.content;
        if (!contains(arr, valueToAdd, ignoreCaseEquals)) {
            onValuesChanged(arr.concat(valueToAdd));
        }
    };
    const onLabelRemove = (labelModel: ILabelModel) => {
        const arr = value || [];
        const valueToRemove = labelModel.content;
        onValuesChanged(arr.filter(v => v.toLowerCase() !== valueToRemove.toLowerCase()));
    };
    const getError = () => {
        const errorMessageFromProp = getErrorMessage && getErrorMessage();
        return errorMessageFromProp || (required && (value == null || value.length === 0) ? "A value is required" : undefined);
    };

    return (
        <LabelledComponent className={css("multi-value-picker", className)} label={label} info={info} getErrorMessage={getError} required={required}>
            <>
                {disabled && (
                    <LabelGroup labelProps={(value || []).map(getTag)} enableHoverStyles={true} wrappingBehavior={WrappingBehavior.freeFlow} />
                )}
                {!disabled && (
                    <EditableLabelGroup
                        labelProps={(value || []).map(getTag)}
                        addButtonText={addButtonText}
                        watermark={placeholder}
                        disableColorPicker={true}
                        enableHoverStyles={true}
                        wrappingBehavior={WrappingBehavior.freeFlow}
                        getSuggestedLabels={getSuggestions(allValues || [], value || [])}
                        onLabelSubmit={onLabelSubmit}
                        onLabelRemove={onLabelRemove}
                    />
                )}
            </>
        </LabelledComponent>
    );
}

const getTag = (value: string): ILabelModel => ({
    content: value
});

function getSuggestions(allValues: string[], selectedValues: string[]) {
    return (filterText: string): ILabelModel[] => {
        if (isNullOrWhiteSpace(filterText) || !allValues) {
            return [];
        }

        return allValues
            .filter(
                value =>
                    value.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
                    findIndex(selectedValues, (selectedValue: string) => equals(selectedValue, value, true)) === -1
            )
            .map(value => {
                return { content: value };
            });
    };
}
