import "./DateTimePickerDropdown.scss";

import * as React from "react";
import { Button } from "azure-devops-ui/Button";
import { css } from "azure-devops-ui/Util";
import { IInputComponentProps, ILabelledComponentProps } from "Common/Components/Contracts";
import { LabelledComponent } from "Common/Components/LabelledComponent";
import { useControlledState } from "Common/Hooks/useControlledState";
import { isDate } from "Common/Utilities/Date";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as format from "date-fns/format";
import * as parse from "date-fns/parse";
import { Callout } from "OfficeFabric/Callout";
import { DateTimePicker } from "./DateTimePicker";

interface IDateTimePickerDropdownOwnProps {
    hideTimePicker?: boolean;
    disableInput?: boolean;
}

type IDateTimePickerDropdownProps = ILabelledComponentProps & IInputComponentProps<string | Date | undefined> & IDateTimePickerDropdownOwnProps;

export function DateTimePickerDropdown(props: IDateTimePickerDropdownProps) {
    const {
        className,
        label,
        info,
        placeholder,
        disableInput,
        getErrorMessage,
        hideTimePicker,
        required,
        disabled,
        onChange,
        value: prop_value
    } = props;
    const targetElement = React.useRef<HTMLDivElement>(null);
    const [isCalloutOpen, setCalloutOpen] = React.useState(false);
    const [value, setValue] = useControlledState(prop_value);

    const toggleCallout = () => setCalloutOpen(!isCalloutOpen);
    const dismissCallout = () => setCalloutOpen(false);
    const fireChange = (value: string | Date) => {
        setValue(value);
        if (onChange) {
            onChange(value);
        }
    };
    const onSelectDate = (date: Date) => {
        fireChange(date);
    };
    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        fireChange(e.target.value);
    };
    const getError = () => {
        const errorMessageFromProp = getErrorMessage && getErrorMessage();
        return errorMessageFromProp || (required && isNullOrEmpty(value) ? "A value is required" : undefined);
    };

    const today = new Date();

    let textValue = "";
    let dateValue: Date | undefined;
    if (value instanceof Date) {
        textValue = format(value, "M/D/YYYY hh:mm A");
        dateValue = value;
    } else if (typeof value === "string") {
        textValue = value;
        dateValue = isDate(value) ? parse(value) : today;
    }

    return (
        <LabelledComponent
            className={css("date-time-picker-dropdown", className, disabled && "disabled")}
            label={label}
            info={info}
            getErrorMessage={getError}
            required={required}
        >
            <>
                <div className={css("date-time-picker-input-container flex-row flex-center", isCalloutOpen && "focused")} ref={targetElement}>
                    <input
                        className={css("date-time-picker-input flex-grow", disableInput && "disabled-input")}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={disableInput}
                        value={textValue}
                        onChange={onTextChange}
                        spellCheck={false}
                        autoComplete="off"
                        onClick={disableInput ? toggleCallout : undefined}
                    />
                    <Button
                        disabled={disabled}
                        iconProps={{
                            iconName: "Calendar"
                        }}
                        className="date-time-picker-icon"
                        onClick={toggleCallout}
                    />
                </div>
                {isCalloutOpen && (
                    <Callout
                        className="date-time-picker-callout"
                        isBeakVisible={false}
                        onDismiss={dismissCallout}
                        setInitialFocus={true}
                        target={targetElement.current}
                        gapSpace={2}
                    >
                        <DateTimePicker hideTimePicker={hideTimePicker} value={dateValue} onDateChange={onSelectDate} />
                    </Callout>
                )}
            </>
        </LabelledComponent>
    );
}
