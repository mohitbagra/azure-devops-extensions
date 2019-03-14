import * as React from "react";

/**
 * A custom hook to use a throttled function delegate
 */
export function useThrottle(fn: (...args: any[]) => void, timeoutInMs: number): (...args: any[]) => void {
    const timeout = React.useRef<number | null>(null);

    React.useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }
        };
    }, []);

    return React.useCallback(
        (...args: any[]) => {
            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }
            timeout.current = setTimeout(() => {
                fn(...args);
                timeout.current = null;
            }, timeoutInMs);
        },
        [fn, timeoutInMs]
    );
}
