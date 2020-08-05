import "./DropdownPicker.scss";

import { IListBoxItem } from "azure-devops-ui/Components/ListBox/ListBox.Props";
import { Dropdown, DropdownCallout, DropdownExpandableTextField } from "azure-devops-ui/Dropdown";
import { css } from "azure-devops-ui/Util";
import { ILabelledComponentProps } from "Common/Components/Contracts";
import { LabelledComponent } from "Common/Components/LabelledComponent";
import { useControlledState } from "Common/Hooks/useControlledState";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as React from "react";

export interface IDropdownPickerSharedProps<T> extends ILabelledComponentProps {
    disabled?: boolean;
    placeholder?: string;
    selectedOption?: T;
    selectedValue?: string;
    onChange?(option?: T, value?: string): void;
}

export interface IDropdownPickerProps<T> extends IDropdownPickerSharedProps<T> {
    options: T[];
    limitedToAllowedOptions?: boolean;
    getDropdownItem(option: T): IListBoxItem;
}

function resolveOptions<T>(options: T[], getDropdownItem: (option: T) => IListBoxItem, required?: boolean) {
    const keyToOptionMap: { [key: string]: T } = {};
    const nameToOptionMap: { [name: string]: T } = {};
    const comboOptions: IListBoxItem[] = [];

    if (!required) {
        comboOptions.push({ id: "", text: "<Empty>", className: "empty-value-item" });
    }
    for (const option of options) {
        const { id, text } = getDropdownItem(option);
        keyToOptionMap[id.toLowerCase()] = option;
        nameToOptionMap[text!.toLowerCase()] = option;

        comboOptions.push({
            id,
            text
        });
    }

    return { comboOptions, keyToOptionMap, nameToOptionMap };
}

function getTextValue<T>(option: T | undefined, value: string | undefined, getDropdownItem: (option: T) => IListBoxItem): string {
    let v = value;
    if (option) {
        v = getDropdownItem(option).text;
    }
    return v || "";
}

function resolveValueToOption<T>(
    option: T | undefined,
    value: string | undefined,
    keyToOptionMap: { [key: string]: T },
    nameToOptionMap: { [name: string]: T }
): { resolvedOption: T | undefined; resolvedValue: string | undefined } {
    if (option) {
        return { resolvedOption: option, resolvedValue: undefined };
    } else if (value) {
        // resolve value to option
        const o = (keyToOptionMap && keyToOptionMap[value.toLowerCase()]) || (nameToOptionMap && nameToOptionMap[value.toLowerCase()]);
        if (o) {
            return { resolvedOption: o, resolvedValue: undefined };
        } else {
            return { resolvedOption: undefined, resolvedValue: value };
        }
    } else {
        return { resolvedOption: undefined, resolvedValue: undefined };
    }
}

export function DropdownPicker<T>(props: IDropdownPickerProps<T>) {
    const {
        className,
        label,
        info,
        getErrorMessage,
        required,
        placeholder,
        disabled,
        options,
        onChange,
        limitedToAllowedOptions,
        getDropdownItem,
        selectedOption: prop_selectedOption,
        selectedValue: prop_selectedValue
    } = props;

    const { comboOptions, keyToOptionMap, nameToOptionMap } = React.useMemo(() => resolveOptions(options, getDropdownItem, required), [
        options,
        required
    ]);
    const { resolvedOption, resolvedValue } = resolveValueToOption(prop_selectedOption, prop_selectedValue, keyToOptionMap, nameToOptionMap);
    const [selectedOption, setSelectedOption] = useControlledState(resolvedOption);
    const [selectedValue, setSelectedValue] = useControlledState(resolvedValue);

    const getError = () => {
        const errorMessageFromProp = getErrorMessage && getErrorMessage();
        if (errorMessageFromProp) {
            return errorMessageFromProp;
        }
        if (!selectedOption && isNullOrEmpty(selectedValue)) {
            return required ? "A value is required." : undefined;
        }
        const doesKeyExist = keyToOptionMap && keyToOptionMap[(selectedValue || "").toLowerCase()] ? true : false;
        const doesNameExist = nameToOptionMap && nameToOptionMap[(selectedValue || "").toLowerCase()] ? true : false;
        const isSelectedValueValid = doesKeyExist || doesNameExist;

        if (limitedToAllowedOptions && !selectedOption && !isSelectedValueValid) {
            return "This value is not in the list of allowed values.";
        }

        return undefined;
    };

    const onItemSelect = (_: unknown, item: IListBoxItem) => {
        let option: T | undefined;
        if (item) {
            option = keyToOptionMap && keyToOptionMap[item.id.toString().toLowerCase()];
        }

        if (option) {
            setSelectedOption(option);
            setSelectedValue(undefined);
        } else {
            setSelectedOption(undefined);
            setSelectedValue((item && item.id) || undefined);
        }

        if (onChange) {
            onChange(option, (item && item.id) || undefined);
        }
    };

    const textValue = getTextValue(selectedOption, selectedValue, getDropdownItem);

    return (
        <LabelledComponent className={css("dropdown-picker", className)} label={label} info={info} getErrorMessage={getError} required={required}>
            <Dropdown
                items={comboOptions}
                onSelect={onItemSelect}
                placeholder={placeholder || "Select a value"}
                showFilterBox={true}
                filterPlaceholderText="Search"
                renderCallout={(props) => (
                    <DropdownCallout {...props} focusOnMount={false} lightDismiss={true} excludeTabStop={true} excludeFocusZone={true} />
                )}
                renderExpandable={(expandableProps) => {
                    return (
                        <DropdownExpandableTextField
                            {...expandableProps}
                            showPrefix={false}
                            className={css(expandableProps.className, !textValue && "show-placeholder")}
                            disabled={disabled}
                            editable={false}
                            value={textValue || placeholder}
                        />
                    );
                }}
            />
        </LabelledComponent>
    );
}

export function dropdownRenderer<T>(
    props: IDropdownPickerSharedProps<T>,
    data: T[] | undefined,
    getDropdownItem: (option: T) => IListBoxItem
): JSX.Element {
    const newProps = {
        ...props,
        getDropdownItem: getDropdownItem,
        options: data || [],
        limitedToAllowedOptions: data != null,
        disabled: data == null ? true : props.disabled,
        selectedOption: data == null ? undefined : props.selectedOption,
        selectedValue: data == null ? undefined : props.selectedValue
    } as IDropdownPickerProps<T>;

    return <DropdownPicker {...newProps} />;
}
