import "./ColorPicker.scss";

import { Button } from "azure-devops-ui/Button";
import { equals } from "azure-devops-ui/Core/Util/String";
import { css } from "azure-devops-ui/Util";
import { IInputComponentProps, ILabelledComponentProps } from "Common/Components/Contracts";
import { LabelledComponent } from "Common/Components/LabelledComponent";
import { useControlledState } from "Common/Hooks/useControlledState";
import { AccessibilityColor } from "Common/Utilities/Color";
import { isNullOrEmpty } from "Common/Utilities/String";
import { Callout } from "OfficeFabric/Callout";
import * as React from "react";

type IColorPickerProps = ILabelledComponentProps & IInputComponentProps<string>;

export function ColorPicker(props: IColorPickerProps) {
    const { className, label, info, getErrorMessage, required, disabled, onChange, value: prop_value } = props;
    const targetElement = React.useRef<HTMLDivElement>(null);

    const [isCalloutOpen, setCalloutOpen] = React.useState(false);
    const [value, setValue] = useControlledState(prop_value);

    const toggleCallout = () => setCalloutOpen(!isCalloutOpen);
    const dismissCallout = () => setCalloutOpen(false);
    const selectColor = (color: string) => {
        setCalloutOpen(false);
        setValue(color);
        if (onChange) {
            onChange(color);
        }
    };
    const getError = () => {
        const errorMessageFromProp = getErrorMessage && getErrorMessage();
        return errorMessageFromProp || (required && isNullOrEmpty(value) ? "A value is required" : undefined);
    };
    const renderColorItem = (color: AccessibilityColor, index: number) => {
        const isSelected = equals(value || "", color.asHex(), true);
        const onSelectColor = () => selectColor(color.asHex());

        return (
            <li
                key={index}
                className={isSelected ? "color-list-item selected" : "color-list-item"}
                onClick={onSelectColor}
                style={{ backgroundColor: color.asRgb() }}
            >
                {isSelected && <div className="inner" />}
            </li>
        );
    };

    return (
        <LabelledComponent className={css("color-picker", className)} label={label} info={info} getErrorMessage={getError} required={required}>
            <>
                <div
                    className={css("selected-color-container flex-row cursor-pointer", isCalloutOpen && "focused", disabled && "disabled")}
                    ref={targetElement}
                >
                    <div
                        className="selected-color"
                        style={value ? { backgroundColor: value } : undefined}
                        onClick={disabled ? undefined : toggleCallout}
                    />
                    <Button disabled={disabled} className="open-callout-button" iconProps={{ iconName: "ChevronDown" }} onClick={toggleCallout} />
                </div>

                {isCalloutOpen && (
                    <Callout
                        className="colors-callout"
                        isBeakVisible={false}
                        gapSpace={4}
                        onDismiss={dismissCallout}
                        setInitialFocus={true}
                        target={targetElement.current}
                    >
                        <ul className="colors-list cursor-pointer">{AccessibilityColor.FullPaletteColors.map(renderColorItem)}</ul>
                    </Callout>
                )}
            </>
        </LabelledComponent>
    );
}
