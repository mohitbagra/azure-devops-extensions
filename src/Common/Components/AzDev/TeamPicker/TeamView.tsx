import "./TeamView.scss";

import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { LoadStatus } from "Common/Contracts";
import { useTeam } from "Common/Hooks/AzDev/Teams";
import { getTeamModule } from "Common/Redux/Teams";
import * as React from "react";

interface ITeamViewOwnProps extends IBaseProps {
    teamId: string;
}

function TeamViewInternal(props: ITeamViewOwnProps) {
    const { teamId, className } = props;
    const { team, status } = useTeam(teamId);

    if (status === LoadStatus.Loading || status === LoadStatus.NotLoaded) {
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
