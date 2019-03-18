import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";
import { getTeams, getTeamsError, getTeamsMap, getTeamsStatus, ITeamAwareState, ITeamState, TeamActions } from "../Redux";

export function useTeams(): ITeamState {
    const { teams, teamsMap, status, error } = useMappedState(mapState);
    const { loadTeams } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadTeams();
        }
    }, []);

    return { teams, teamsMap, status, error };
}

function mapState(state: ITeamAwareState): ITeamState {
    return {
        teams: getTeams(state),
        teamsMap: getTeamsMap(state),
        status: getTeamsStatus(state),
        error: getTeamsError(state)
    };
}

const Actions = {
    loadTeams: TeamActions.loadRequested
};
