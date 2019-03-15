import "./PicklistPicker.scss";

import { IPickListItem, IPickListSelection, PickListDropdown } from "azure-devops-ui/PickList";
import { css } from "azure-devops-ui/Util";
import { ILabelledComponentProps } from "Common/Components/Contracts";
import { LabelledComponent } from "Common/Components/LabelledComponent";
import { useControlledState } from "Common/Hooks/useControlledState";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as React from "react";

export interface IPicklistPickerSharedProps<T> extends ILabelledComponentProps {
    disabled?: boolean;
    placeholder?: string;
    selectedOption?: T;
    selectedValue?: string;
    onChange?(option?: T, value?: string): void;
}

export interface IPicklistPickerProps<T> extends IPicklistPickerSharedProps<T> {
    options: T[];
    limitedToAllowedOptions?: boolean;
    getPicklistItem(option: T): IPickListItem;
}

function resolveOptions<T>(options: T[], getPicklistItem: (option: T) => IPickListItem, required?: boolean) {
    const keyToOptionMap: { [key: string]: T } = {};
    const nameToOptionMap: { [name: string]: T } = {};
    const comboOptions: IPickListItem[] = [];

    if (!required) {
        comboOptions.push({ key: "", name: "<Empty>" });
    }
    for (const option of options) {
        const { key, name } = getPicklistItem(option);
        keyToOptionMap[key.toLowerCase()] = option;
        nameToOptionMap[name.toLowerCase()] = option;

        comboOptions.push({
            key: key,
            name: name
        });
    }

    return { comboOptions, keyToOptionMap, nameToOptionMap };
}

function getTextValue<T>(option: T | undefined, value: string | undefined, getPicklistItem: (option: T) => IPickListItem): string {
    let v = value;
    if (option) {
        v = getPicklistItem(option).name;
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

export function PicklistPicker<T>(props: IPicklistPickerProps<T>) {
    const {
        className,
        label,
        info,
        getErrorMessage,
        required,
        disabled,
        placeholder,
        options,
        onChange,
        limitedToAllowedOptions,
        getPicklistItem,
        selectedOption: prop_selectedOption,
        selectedValue: prop_selectedValue
    } = props;

    const { comboOptions, keyToOptionMap, nameToOptionMap } = React.useMemo(() => resolveOptions(options, getPicklistItem, required), [
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

    const onPicklistSelectionChange = (selection: IPickListSelection) => {
        const o: IPickListItem | undefined = selection && selection.selectedItems ? (selection.selectedItems[0] as IPickListItem) : undefined;
        let option: T | undefined;
        if (o) {
            option = keyToOptionMap && keyToOptionMap[o.key.toString().toLowerCase()];
        }

        if (option) {
            setSelectedOption(option);
            setSelectedValue(undefined);
        } else {
            setSelectedOption(undefined);
            setSelectedValue((o && o.key) || undefined);
        }

        if (onChange) {
            onChange(option, (o && o.key) || undefined);
        }
    };
    const getComboOptions = () => comboOptions;

    const textValue = getTextValue(selectedOption, selectedValue, getPicklistItem);

    return (
        <LabelledComponent className={css("picklist-picker", className)} label={label} info={info} getErrorMessage={getError} required={required}>
            <PickListDropdown
                pickListClassName="picklist-picker-dropdown"
                selectedItems={textValue ? [{ key: textValue, name: textValue }] : undefined}
                isSearchable={true}
                searchTextPlaceholder="Search"
                placeholder={placeholder || "Select a value"}
                getPickListItems={getComboOptions}
                getListItem={getListItem}
                disabled={disabled}
                onSelectionChanged={onPicklistSelectionChange}
                onRenderItemText={onRenderItemText}
            />
        </LabelledComponent>
    );
}

function onRenderItemText(item: IPickListItem): JSX.Element {
    if (item.key) {
        return <>{item.name}</>;
    } else {
        return <span className="empty-value-item">{item.name}</span>;
    }
}

function getListItem(item: IPickListItem): IPickListItem {
    return item;
}

export function picklistRenderer<T>(
    props: IPicklistPickerSharedProps<T>,
    data: T[] | undefined,
    getPicklistItem: (option: T) => IPickListItem
): JSX.Element {
    const newProps = {
        ...props,
        getPicklistItem,
        options: data || [],
        limitedToAllowedOptions: data != null,
        disabled: data == null ? true : props.disabled,
        selectedOption: data == null ? undefined : props.selectedOption,
        selectedValue: data == null ? undefined : props.selectedValue
    } as IPicklistPickerProps<T>;

    return <PicklistPicker {...newProps} />;
}
