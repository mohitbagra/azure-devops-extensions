import "./ValueSpinner.scss";

import * as React from "react";
import { Button } from "azure-devops-ui/Button";
import { useControlledState } from "Common/Hooks/useControlledState";

export class NumericValueRange implements IValueRange<number> {
    constructor(
        private _min: number,
        private _max: number,
        private _valueFormatter: (n: number) => string = (n: number) => n.toString(),
        private _increment: number = 1
    ) {}

    public getPreviousValue(value: number): number {
        let v = value - this._increment;
        if (v < this._min) {
            v = this._max;
        }

        return v;
    }

    public getNextValue(value: number): number {
        let v = value + this._increment;
        if (v > this._max) {
            v = this._min;
        }

        return v;
    }

    public toString(value: number): string {
        return this._valueFormatter(value);
    }
}

export class CategoryRange implements IValueRange<string> {
    constructor(private _values: string[]) {}

    public getPreviousValue(value: string): string {
        let index = this._values.indexOf(value);
        index--;

        if (index < 0) {
            index = this._values.length - 1;
        }

        return this._values[index];
    }

    public getNextValue(value: string): string {
        let index = this._values.indexOf(value);
        index++;

        if (index >= this._values.length) {
            index = 0;
        }

        return this._values[index];
    }

    public toString(value: string): string {
        return value;
    }
}

interface IValueRange<T> {
    getNextValue(value: T): T;
    getPreviousValue(value: T): T;
    toString(value: T): string;
}

interface IValueSpinnerProps<T> {
    value: T;
    valueRange: IValueRange<T>;
    onValueChange?(value: T): void;
}

export function ValueSpinner<T>(props: IValueSpinnerProps<T>) {
    const { value: prop_value, valueRange, onValueChange } = props;
    const [value, setValue] = useControlledState(prop_value);

    const onValueChanged = (v: T) => {
        setValue(v);
        if (onValueChange) {
            onValueChange(v);
        }
    };
    const setPreviousValue = () => onValueChanged(valueRange.getPreviousValue(value));
    const setNextValue = () => onValueChanged(valueRange.getNextValue(value));

    return (
        <div className="value-spinner flex-column flex-center">
            <Button
                className="spinner-up"
                onClick={setNextValue}
                iconProps={{
                    iconName: "ChevronUp"
                }}
            />
            <div className="spinner-value">{valueRange.toString(value)}</div>
            <Button
                className="spinner-down"
                onClick={setPreviousValue}
                iconProps={{
                    iconName: "ChevronDown"
                }}
            />
        </div>
    );
}
