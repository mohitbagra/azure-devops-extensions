export function memoizePromise<TResult, P extends any[]>(func: (...args: P) => Promise<TResult>, generateKey: (...args: P) => string) {
    const cache: { [key: string]: Promise<TResult> } = {};

    const fn = async (cacheKey: string, ...args: P) => {
        try {
            const result = await func(...args);
            delete cache[cacheKey];
            return result;
        } catch (e) {
            delete cache[cacheKey];
            throw e;
        }
    };

    return (...args: P) => {
        const key = generateKey(...args).toLowerCase();
        if (cache[key]) {
            return cache[key];
        } else {
            const promise = fn(key, ...args);
            cache[key] = promise;
            return promise;
        }
    };
}
