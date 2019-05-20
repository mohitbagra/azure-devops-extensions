import { useMappedState } from "Common/Hooks/useMappedState";
import { IChecklistAwareState } from "../Redux/Checklist/Contracts";
import { getSuggestedLabels } from "../Redux/Checklist/Selectors";

export function useChecklistLabels(): string[] {
    return useMappedState((state: IChecklistAwareState) => getSuggestedLabels(state));
}
