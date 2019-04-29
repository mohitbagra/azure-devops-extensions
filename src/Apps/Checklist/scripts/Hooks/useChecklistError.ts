import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback } from "react";
import { IChecklistAwareState } from "../Redux/Contracts";
import { getChecklistError } from "../Redux/Selectors";

export function useChecklistError(idOrType: number | string): string | undefined {
    const mapState = useCallback((state: IChecklistAwareState) => getChecklistError(state, idOrType), [idOrType]);
    return useMappedState(mapState);
}
