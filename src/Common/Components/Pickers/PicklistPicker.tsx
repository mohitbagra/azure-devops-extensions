import "./PicklistPicker.scss";

import { IListBoxItem } from "azure-devops-ui/Components/ListBox/ListBox.Props";
import { ITableColumn } from "azure-devops-ui/Components/Table/Table.Props";
import { Dropdown, DropdownCallout, DropdownExpandableTextField } from "azure-devops-ui/Dropdown";
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
    getPicklistItem(option: T): IListBoxItem;
}

function resolveOptions<T>(options: T[], getPicklistItem: (option: T) => IListBoxItem, required?: boolean) {
    const keyToOptionMap: { [key: string]: T } = {};
    const nameToOptionMap: { [name: string]: T } = {};
    const comboOptions: IListBoxItem[] = [];

    if (!required) {
        comboOptions.push({ id: "", text: "<Empty>" });
    }
    for (const option of options) {
        const { id, text } = getPicklistItem(option);
        keyToOptionMap[id.toLowerCase()] = option;
        nameToOptionMap[text!.toLowerCase()] = option;

        comboOptions.push({
            id,
            text
        });
    }

    return { comboOptions, keyToOptionMap, nameToOptionMap };
}

function getTextValue<T>(option: T | undefined, value: string | undefined, getPicklistItem: (option: T) => IListBoxItem): string {
    let v = value;
    if (option) {
        v = getPicklistItem(option).text;
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
        placeholder,
        disabled,
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

    const onPicklistSelectionChange = (_event: React.SyntheticEvent<HTMLElement, Event>, item: IListBoxItem) => {
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

    const textValue = getTextValue(selectedOption, selectedValue, getPicklistItem);

    return (
        <LabelledComponent className={css("picklist-picker", className)} label={label} info={info} getErrorMessage={getError} required={required}>
            <>
                <Dropdown
                    items={comboOptions}
                    onSelect={onPicklistSelectionChange}
                    placeholder={placeholder || "Select a value"}
                    showFilterBox={true}
                    filterPlaceholderText="Search"
                    renderItem={onRenderItemText}
                    renderCallout={props => (
                        <DropdownCallout {...props} focusOnMount={false} lightDismiss={true} excludeTabStop={true} excludeFocusZone={true} />
                    )}
                    renderExpandable={expandableProps => {
                        return <DropdownExpandableTextField {...expandableProps} disabled={disabled} editable={false} value={textValue} />;
                    }}
                />
            </>
        </LabelledComponent>
    );
}

function onRenderItemText(_rowIndex: number, _columnIndex: number, _tableColumn: ITableColumn<IListBoxItem>, item: IListBoxItem): JSX.Element {
    if (item.id) {
        return <>{item.text}</>;
    } else {
        return <span className="empty-value-item">{item.text}</span>;
    }
}

export function picklistRenderer<T>(
    props: IPicklistPickerSharedProps<T>,
    data: T[] | undefined,
    getPicklistItem: (option: T) => IListBoxItem
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
