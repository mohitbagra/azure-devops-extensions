import { useCallback, useEffect } from "react";

import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { IGroupedChecklists } from "../Interfaces";
import { ChecklistActions } from "../Redux/Checklist/Actions";
import { IChecklistAwareState } from "../Redux/Checklist/Contracts";
import { getChecklistStatus, getFilteredChecklists } from "../Redux/Checklist/Selectors";

export function useChecklists(idOrType: number | string): IGroupedChecklists {
    const mapState = useCallback(
        (state: IChecklistAwareState) => {
            return {
                checklists: getFilteredChecklists(state, idOrType),
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
