import "./DateTimePicker.scss";

import * as React from "react";
import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { TimePicker } from "Common/Components/Pickers/TimePicker";
import { useControlledState } from "Common/Hooks/useControlledState";
import { Calendar } from "OfficeFabric/Calendar";
import { IDatePickerStrings } from "OfficeFabric/components/DatePicker/DatePicker.types";

interface IDateTimePickerProps extends IBaseProps {
    value?: Date;
    hideTimePicker?: boolean;
    onDateChange?(date: Date): void;
}

const DEFAULT_STRINGS: IDatePickerStrings = {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    shortDays: ["S", "M", "T", "W", "T", "F", "S"],

    goToToday: "Go to today",
    prevMonthAriaLabel: "Go to previous month",
    nextMonthAriaLabel: "Go to next month",
    prevYearAriaLabel: "Go to previous year",
    nextYearAriaLabel: "Go to next year"
};

export function DateTimePicker(props: IDateTimePickerProps) {
    const { className, hideTimePicker, onDateChange, value } = props;
    const [selectedDate, setSelectedDate] = useControlledState(value);
    const today = new Date();
    const selDate = selectedDate || today;

    const dateSelected = (date: Date) => {
        const newDate = new Date(date.getTime());
        const hour = selDate.getHours();
        const minute = selDate.getMinutes();
        newDate.setHours(hour);
        newDate.setMinutes(minute);
        setSelectedDate(newDate);

        if (onDateChange) {
            onDateChange(newDate);
        }
    };
    const timeSelected = (hour: number, minute: number) => {
        const newDate = new Date(selDate.getTime());
        newDate.setHours(hour);
        newDate.setMinutes(minute);
        setSelectedDate(newDate);

        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    return (
        <div className={css("date-time-picker flex-row flex-center", className)}>
            <Calendar
                className="date-time-picker-calendar"
                onSelectDate={dateSelected}
                isMonthPickerVisible={true}
                showGoToToday={false}
                today={today}
                value={selDate}
                strings={DEFAULT_STRINGS}
            />
            {!hideTimePicker && (
                <TimePicker className="date-time-picker-time" onSelectTime={timeSelected} hour={selDate.getHours()} minute={selDate.getMinutes()} />
            )}
        </div>
    );
}
