import * as isValid from "date-fns/is_valid";
import * as parse from "date-fns/parse";

export function isDate(value: string): boolean {
    return isValid(parse(value));
}

export function defaultDateComparer(date1: Date | undefined, date2: Date | undefined): number {
    if (date1 instanceof Date && date2 instanceof Date) {
        return date1.getTime() - date2.getTime();
    }

    if (date1 instanceof Date) {
        return 1;
    }

    if (date2 instanceof Date) {
        return -1;
    }

    return 0;
}
