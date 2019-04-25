import { IIconProps } from "azure-devops-ui/Components/Icon/Icon.Props";
import { ITextFieldProps as VSSUI_TextFieldProps, TextField as VSSUI_TextField } from "azure-devops-ui/TextField";
import { css } from "azure-devops-ui/Util";
import { IInputComponentProps, ILabelledComponentProps } from "Common/Components/Contracts";
import { LabelledComponent } from "Common/Components/LabelledComponent";
import { useControlledState } from "Common/Hooks/useControlledState";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as React from "react";

interface ITextFieldProps extends ILabelledComponentProps, IInputComponentProps<string> {
    autoFocus?: boolean;
    inputClassName?: string;
    maxLength?: number;
    multiline?: boolean;
    prefixIconProps?: IIconProps;
    suffixIconProps?: IIconProps;
    onBlur?: () => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function TextField(props: ITextFieldProps) {
    const { className, onChange, label, info, getErrorMessage, required, value: prop_value } = props;
    const [value, setValue] = useControlledState(prop_value);

    const onTextChanged = (_ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string) => {
        if (value !== newValue) {
            setValue(newValue);
            if (onChange) {
                onChange(newValue);
            }
        }
    };
    const getError = () => {
        const errorMessageFromProp = getErrorMessage && getErrorMessage();
        return errorMessageFromProp || (required && isNullOrEmpty(value) ? "A value is required" : undefined);
    };

    const inputProps: VSSUI_TextFieldProps = {
        autoFocus: props.autoFocus,
        inputClassName: props.inputClassName,
        maxLength: props.maxLength,
        multiline: props.multiline,
        placeholder: props.placeholder,
        prefixIconProps: props.prefixIconProps,
        suffixIconProps: props.suffixIconProps,
        onBlur: props.onBlur,
        onFocus: props.onFocus,
        onKeyDown: props.onKeyDown,
        onKeyUp: props.onKeyUp,
        disabled: props.disabled,
        value: value || "",
        onChange: onTextChanged,
        className: "text-field-input"
    };

    return (
        <LabelledComponent className={css("text-field", className)} label={label} info={info} getErrorMessage={getError} required={required}>
            <VSSUI_TextField {...inputProps} />
        </LabelledComponent>
    );
}
