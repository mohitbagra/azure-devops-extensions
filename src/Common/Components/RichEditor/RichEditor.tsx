import { css } from "azure-devops-ui/Util";
import { IInputComponentProps, ILabelledComponentProps } from "Common/Components/Contracts";
import { LabelledComponent } from "Common/Components/LabelledComponent";
import { HtmlEditor } from "Common/Components/RichEditor/HtmlEditor";
import { useControlledState } from "Common/Hooks/useControlledState";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as React from "react";

export interface IRichEditorProps extends ILabelledComponentProps, IInputComponentProps<string> {
    placeholder?: string;
    uploadImageHandler?: (file: File) => Promise<string>;
    height?: number;
    autoFocus?: boolean;
}

export function RichEditor(props: IRichEditorProps) {
    const {
        className,
        label,
        info,
        height,
        autoFocus,
        uploadImageHandler,
        getErrorMessage,
        placeholder,
        required,
        disabled,
        onChange,
        value: prop_value
    } = props;
    const [value, setValue] = useControlledState(prop_value);

    const getError = () => {
        const errorMessageFromProp = getErrorMessage && getErrorMessage();
        return errorMessageFromProp || (required && isNullOrEmpty(value) ? "A value is required" : undefined);
    };

    const onTextChanged = (newValue: string) => {
        if (value !== newValue) {
            setValue(newValue);
            if (onChange) {
                onChange(newValue);
            }
        }
    };

    return (
        <LabelledComponent
            className={css("rich-editor-container", className)}
            label={label}
            info={info}
            getErrorMessage={getError}
            required={required}
        >
            <HtmlEditor
                htmlContent={value || ""}
                onChange={onTextChanged}
                readonly={disabled}
                placeholder={placeholder}
                height={height}
                autoFocus={autoFocus}
                uploadImageHandler={uploadImageHandler}
            />
        </LabelledComponent>
    );
}
