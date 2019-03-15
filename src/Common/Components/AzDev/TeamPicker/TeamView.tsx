import "./TeamView.scss";

import { WebApiTeam } from "azure-devops-extension-api/Core";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    areTeamsLoading, getTeam, getTeamModule, getTeams, ITeamAwareState, TeamActions
} from "Common/Redux/Teams";
import * as React from "react";

interface ITeamViewOwnProps extends IBaseProps {
    teamId: string;
}

interface ITeamViewStateProps {
    teams?: WebApiTeam[];
    team?: WebApiTeam;
    loading: boolean;
}

const Actions = {
    loadTeams: TeamActions.loadRequested
};

function TeamViewInternal(props: ITeamViewOwnProps) {
    const { teamId, className } = props;
    const mapStateToProps = React.useCallback(
        (state: ITeamAwareState): ITeamViewStateProps => {
            return {
                teams: getTeams(state),
                team: getTeam(state, teamId),
                loading: areTeamsLoading(state)
            };
        },
        [teamId]
    );

    const { teams, team, loading } = useMappedState(mapStateToProps);
    const { loadTeams } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!teams && !loading) {
            loadTeams();
        }
    }, []);

    if (!teams || loading) {
        return null;
    }

    let innerElement: JSX.Element;
    if (!team) {
        innerElement = (
            <Tooltip text={`Team "${teamId}" not found`}>
                <span className="text-ellipsis">{teamId}</span>
            </Tooltip>
        );
    } else {
        innerElement = (
            <Tooltip overflowOnly={true}>
                <span className="text-ellipsis">{team.name}</span>
            </Tooltip>
        );
    }

    return <span className={css(className, "team-view flex-row flex-center", !team && "error")}>{innerElement}</span>;
}

export function TeamView(props: ITeamViewOwnProps) {
    return (
        <DynamicModuleLoader modules={[getTeamModule()]}>
            <TeamViewInternal {...props} />
        </DynamicModuleLoader>
    );
}
