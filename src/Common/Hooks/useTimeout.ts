import { useEffect, useState } from "react";

export function useTimeout(delay: number) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setReady(true);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [delay]);

    return ready;
}
