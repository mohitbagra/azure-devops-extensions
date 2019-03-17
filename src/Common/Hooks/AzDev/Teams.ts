import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { LoadStatus } from "Common/Contracts";
import { getTeam, getTeams, getTeamsError, getTeamsMap, getTeamsStatus, TeamActions } from "Common/Redux/Teams";
import { ITeamAwareState, ITeamState } from "Common/Redux/Teams/Contracts";
import { useCallback, useEffect } from "react";
import { useActionCreators, useMappedState } from "../Redux";

export function useTeams(): ITeamState {
    const { teams, teamsMap, status, error } = useMappedState(mapTeamsState);
    const { loadTeams } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadTeams();
        }
    }, []);

    return { teams, teamsMap, status, error };
}

export function useTeam(teamId: string): { team: WebApiTeam | undefined; status: LoadStatus } {
    const mapStateToProps = useCallback(
        (state: ITeamAwareState) => {
            return {
                team: getTeam(state, teamId),
                status: getTeamsStatus(state)
            };
        },
        [teamId]
    );
    const { team, status } = useMappedState(mapStateToProps);
    const { loadTeams } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadTeams();
        }
    }, []);

    return { team, status };
}

function mapTeamsState(state: ITeamAwareState): ITeamState {
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
