export function memoizePromise<T>(func: (...args: any[]) => Promise<T>, generateKey: (...args: any[]) => string) {
    const cache: { [key: string]: Promise<T> } = {};

    return (...args: any[]) => {
        const key = generateKey(...args);
        if (cache[key]) {
            return cache[key];
        } else {
            const promise = func(...args);
            cache[key] = promise;
            return promise;
        }
    };
}
