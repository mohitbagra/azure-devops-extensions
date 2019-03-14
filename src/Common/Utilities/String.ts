import * as format from "date-fns/format";

export function htmlEncode(str: string): string {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));

    // The trick we are using here doesnt encode quotes. So we have to replace them using regexp search
    return div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function isNullOrWhiteSpace(value: any): boolean {
    return value == null || (typeof value === "string" && value.trim() === "");
}

export function isNullOrEmpty(value: any): boolean {
    return value == null || value === "";
}

export function toString(val: any): string {
    if (typeof val === "boolean") {
        return val ? "True" : "False";
    } else if (typeof val === "number") {
        return `${val}`;
    } else if (val instanceof Date) {
        return format(val);
    } else {
        return val;
    }
}

export function hashCode(str: string): number {
    if (isNullOrWhiteSpace(str)) {
        return 0;
    }

    let hash = 0;
    const trimmedString = str.trim();

    for (let i = 0; i < trimmedString.length; i++) {
        const ch = str.charCodeAt(i);
        hash = (hash << 5) - hash + ch;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
}

export function ignoreCaseEquals(a: string, b: string): boolean {
    return (a || "").toLowerCase() === (b || "").toLowerCase();
}
