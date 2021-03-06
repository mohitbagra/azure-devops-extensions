function defaultComparer<T>(a: T, b: T): number {
    if (a === b) {
        return 0;
    } else if (a > b) {
        return 1;
    } else {
        return -1;
    }
}

function defaultComparison<T>(a: T, b: T): boolean {
    return a === b;
}

export function first<T>(array: T[], predicate?: (value: T) => boolean): T | null {
    if (!array || array.length === 0) {
        return null;
    }

    if (predicate == null) {
        return array[0];
    }

    const items = array.filter(predicate);
    return items && items.length > 0 ? items[0] : null;
}

export function findIndex<T>(array: T[], predicate: (param: T) => boolean): number {
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            return i;
        }
    }

    return -1;
}

export function uniqueSort<T>(array: T[], comparer?: (a: T, b: T) => number): T[] {
    const innerComparer = comparer || defaultComparer;

    array.sort(innerComparer);
    let l = array.length;

    for (let i = 1; i < l; i++) {
        if (innerComparer(array[i], array[i - 1]) === 0) {
            array.splice(i--, 1);
            l--;
        }
    }

    return array;
}

export function union<T>(arrayA: T[], arrayB: T[], comparer?: (a: T, b: T) => number): T[] {
    if (!arrayB || arrayB.length === 0) {
        return arrayA;
    }

    const result = arrayA.concat(arrayB);
    uniqueSort(result, comparer);

    return result;
}

export function unique<T>(array: T[], comparer?: (a: T, b: T) => number): T[] {
    const result = array.slice(0);
    uniqueSort(result, comparer);

    return result;
}

export function removeAllIndexes<T>(array: T[], indexes: number[]): boolean {
    let result = true;
    const sortedIndexes = indexes.slice();
    sortedIndexes.sort((a, b) => Number(a) - Number(b));
    for (let i = sortedIndexes.length - 1; i >= 0; --i) {
        const index = sortedIndexes[i];
        if (index >= array.length || index < 0) {
            result = false;
            continue;
        }
        array.splice(index, 1);
    }
    return result;
}

export function contains<T>(array: T[], value: T, comparer: (s: T, t: T) => boolean): boolean {
    if (value == null) {
        return false;
    }

    for (const item of array) {
        if (comparer(item, value)) {
            return true;
        }
    }

    return false;
}

export function removeWhere<T>(array: T[], predicate: (element: T) => boolean, count?: number, startAt = 0) {
    const indexesToRemove: number[] = [];
    for (let i = startAt; i < array.length; ++i) {
        if (predicate(array[i])) {
            indexesToRemove.push(i);
            if (indexesToRemove.length === count) {
                break;
            }
        }
    }
    removeAllIndexes(array, indexesToRemove);
}

export function removeAtIndex<T>(array: T[], index: number): boolean {
    return removeAllIndexes(array, [index]);
}

export function subtract<T>(arrayA: T[], arrayB: T[], comparer: (s: T, t: T) => boolean): T[] {
    const result: T[] = [];

    if (!arrayA || arrayA.length === 0 || !arrayB || arrayB.length === 0) {
        return arrayA;
    }

    for (const val of arrayA) {
        if (!contains(arrayB, val, comparer)) {
            result.push(val);
        }
    }

    return result;
}

export function arrayEquals<T>(source: T[], target: T[], comparer?: (s: T, t: T) => boolean, sorted = false): boolean {
    if (!source && !target) {
        return true;
    }
    if ((!source && target) || (source && !target)) {
        return false;
    }

    if (source.length !== target.length) {
        return false;
    }

    const innerComparer = comparer || defaultComparison;

    if (!sorted) {
        for (const s of source) {
            if (!contains(target, s, innerComparer)) {
                return false;
            }
        }
    } else {
        for (let i = 0; i < source.length; i++) {
            if (!innerComparer(source[i], target[i])) {
                return false;
            }
        }
    }

    return true;
}

export function toDictionary<TArray, TValue>(
    array: TArray[] | undefined,
    getKey: (item: TArray, index?: number) => string,
    getValue: (item: TArray, index?: number) => TValue
): { [key: string]: TValue } {
    const lookup: { [key: string]: TValue } = {};

    (array || []).forEach((item: TArray, index: number) => {
        const key = getKey(item, index);
        if (key) {
            lookup[key] = getValue(item, index);
        }
    });

    return lookup;
}
