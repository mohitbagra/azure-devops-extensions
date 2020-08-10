import { useEffect } from "react";

import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { TeamActions } from "../Redux/Actions";
import { ITeamAwareState, ITeamState } from "../Redux/Contracts";
import { getTeams, getTeamsError, getTeamsMap, getTeamsStatus } from "../Redux/Selectors";

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
