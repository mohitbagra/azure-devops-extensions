import "./TimePicker.scss";

import * as React from "react";

import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { useControlledState } from "Common/Hooks/useControlledState";

import { CategoryRange, NumericValueRange, ValueSpinner } from "./ValueSpinner";

interface ITimePickerProps extends IBaseProps {
    hour: number;
    minute: number;
    onSelectTime?(hour: number, minute: number): void;
}

export function TimePicker(props: ITimePickerProps) {
    const { className, onSelectTime, hour: prop_hour, minute: prop_minute } = props;
    const [hour, setHour] = useControlledState(prop_hour === 0 ? 12 : prop_hour > 12 ? prop_hour - 12 : prop_hour);
    const [minute, setMinute] = useControlledState(prop_minute);
    const [isAM, setIsAM] = useControlledState(prop_hour >= 12 ? false : true);

    const hourRange = new NumericValueRange(1, 12);
    const minuteRange = new NumericValueRange(0, 59, (n: number) => (n < 10 ? `0${n}` : n.toString()));
    const AMPMRange = new CategoryRange(["AM", "PM"]);

    const onTimeSelected = (h: number, m: number, isam: boolean) => {
        let hh = h;
        if (onSelectTime) {
            if (!isam && h !== 12) {
                hh = h + 12;
            } else if (isam && h === 12) {
                hh = 0;
            }
            onSelectTime(hh, m);
        }
    };

    const onHourChange = (value: number) => {
        setHour(value);
        onTimeSelected(value, minute, isAM);
    };

    const onMinuteChange = (value: number) => {
        setMinute(value);
        onTimeSelected(hour, value, isAM);
    };

    const onAMPMChange = (value: string) => {
        const newValue = (value || "").toLowerCase() === "am";
        setIsAM(newValue);
        onTimeSelected(hour, minute, newValue);
    };

    return (
        <div className={css("time-picker flex-row flex-center", className)}>
            <ValueSpinner<number> value={hour} valueRange={hourRange} onValueChange={onHourChange} />
            <ValueSpinner<number> value={minute} valueRange={minuteRange} onValueChange={onMinuteChange} />
            <ValueSpinner<string> value={isAM ? "AM" : "PM"} valueRange={AMPMRange} onValueChange={onAMPMChange} />
        </div>
    );
}
