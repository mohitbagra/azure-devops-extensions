import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { ChecklistType, IChecklist } from "../Interfaces";
import { ChecklistActions } from "../Redux/Actions";
import { IChecklistAwareState } from "../Redux/Contracts";
import { getChecklist, getChecklistStatus } from "../Redux/Selectors";

export function useChecklist(idOrType: number | string, checklistType: ChecklistType): IChecklist | undefined {
    const mapState = useCallback(
        (state: IChecklistAwareState) => {
            return {
                checklist: getChecklist(state, idOrType, checklistType),
                status: getChecklistStatus(state, idOrType)
            };
        },
        [idOrType, checklistType]
    );

    const { checklist, status } = useMappedState(mapState);
    const { loadChecklist } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadChecklist(idOrType);
        }
    }, [idOrType]);

    return checklist;
}

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested
};
