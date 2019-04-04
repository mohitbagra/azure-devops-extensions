import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { KeyValuePairActions } from "../Redux/Actions";
import { IKeyValuePairAwareState } from "../Redux/Contracts";
import { getKeyValue } from "../Redux/Selectors";

export function useKeyValuePair<T>(key: string): { value: T | undefined; dismissEntry: () => void } {
    const mapState = useCallback(
        (state: IKeyValuePairAwareState): IUseKeyValuePairMappedState<T> => {
            return {
                value: getKeyValue<T>(state, key)
            };
        },
        [key]
    );
    const { value } = useMappedState(mapState);
    const { dismissEntry } = useActionCreators(Actions);

    const onDismiss = useCallback(() => {
        dismissEntry(key);
    }, [key]);

    useEffect(() => {
        return onDismiss;
    }, []);

    return { value, dismissEntry: onDismiss };
}

interface IUseKeyValuePairMappedState<T> {
    value: T | undefined;
}

const Actions = {
    dismissEntry: KeyValuePairActions.dismissEntry
};
