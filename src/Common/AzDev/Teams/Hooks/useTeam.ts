import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";
import { getTeam, getTeamsError, getTeamsStatus, ITeamAwareState, TeamActions } from "../Redux";

export function useTeam(teamIdOrName: string): IUseTeamMappedState {
    const mapState = useCallback(
        (state: ITeamAwareState) => {
            return {
                team: getTeam(state, teamIdOrName),
                status: getTeamsStatus(state),
                error: getTeamsError(state)
            };
        },
        [teamIdOrName]
    );
    const { team, status, error } = useMappedState(mapState);
    const { loadTeams } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadTeams();
        }
    }, []);

    return { team, status, error };
}

interface IUseTeamMappedState {
    team: WebApiTeam | undefined;
    status: LoadStatus;
    error: string | undefined;
}

const Actions = {
    loadTeams: TeamActions.loadRequested
};
