import * as React from "react";
import { WebApiTeam } from "azure-devops-extension-api/Core";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    IPicklistPickerSharedProps, picklistRenderer
} from "Common/Components/Pickers/PicklistPicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    areTeamsLoading, getTeamModule, getTeams, ITeamAwareState, TeamActions
} from "Common/Redux/Teams";

interface ITeamPickerStateProps {
    teams?: WebApiTeam[];
    loading: boolean;
}

function mapStateToProps(state: ITeamAwareState): ITeamPickerStateProps {
    return {
        teams: getTeams(state),
        loading: areTeamsLoading(state)
    };
}

const Actions = {
    loadTeams: TeamActions.loadRequested
};

function TeamPickerInternal(props: IPicklistPickerSharedProps<WebApiTeam>) {
    const { placeholder } = props;
    const { teams, loading } = useMappedState(mapStateToProps);
    const { loadTeams } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!teams && !loading) {
            loadTeams();
        }
    }, []);

    return picklistRenderer({ ...props, placeholder: placeholder || "Select a team" }, teams, (team: WebApiTeam) => ({
        key: team.id,
        name: team.name
    }));
}

export function TeamPicker(props: IPicklistPickerSharedProps<WebApiTeam>) {
    return (
        <DynamicModuleLoader modules={[getTeamModule()]}>
            <TeamPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
