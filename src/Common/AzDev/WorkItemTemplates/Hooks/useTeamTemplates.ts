import { WorkItemTemplateReference } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { getTeamTemplates, getTeamTemplatesError, getTeamTemplatesStatus, IWorkItemTemplateAwareState, TeamTemplatesActions } from "../Redux";

export function useTeamTemplates(teamId: string): IUseTeamTemplatesMappedState {
    const mapState = useCallback(
        (state: IWorkItemTemplateAwareState) => {
            return {
                templates: getTeamTemplates(state, teamId),
                status: getTeamTemplatesStatus(state, teamId),
                error: getTeamTemplatesError(state, teamId)
            };
        },
        [teamId]
    );

    const { templates, status, error } = useMappedState(mapState);
    const { loadTeamTemplates } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadTeamTemplates(teamId);
        }
    }, [teamId]);

    return { templates, status, error };
}

interface IUseTeamTemplatesMappedState {
    status: LoadStatus;
    error: string | undefined;
    templates: WorkItemTemplateReference[] | undefined;
}

const Actions = {
    loadTeamTemplates: TeamTemplatesActions.loadRequested
};
