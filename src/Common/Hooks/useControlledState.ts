import * as React from "react";

/**
 * A custom hook to use a controlled state to refresh the state value based on the parameter
 */
export function useControlledState<T>(controlledValue: T): [T, (newValue: T) => void] {
    const [value, setValue] = React.useState(controlledValue);
    React.useEffect(
        () => {
            if (value !== controlledValue) {
                setValue(controlledValue);
            }
        },
        [controlledValue]
    );
    return [value, setValue];
}
