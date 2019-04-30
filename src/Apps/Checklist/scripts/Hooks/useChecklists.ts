import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { IGroupedChecklists } from "../Interfaces";
import { ChecklistActions } from "../Redux/Actions";
import { IChecklistAwareState } from "../Redux/Contracts";
import { getChecklists, getChecklistStatus } from "../Redux/Selectors";

export function useChecklists(idOrType: number | string): IGroupedChecklists {
    const mapState = useCallback(
        (state: IChecklistAwareState) => {
            return {
                checklists: getChecklists(state, idOrType),
                status: getChecklistStatus(state, idOrType)
            };
        },
        [idOrType]
    );

    const { checklists, status } = useMappedState(mapState);
    const { loadChecklist } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadChecklist(idOrType);
        }
    }, [idOrType]);

    return checklists;
}

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested
};
