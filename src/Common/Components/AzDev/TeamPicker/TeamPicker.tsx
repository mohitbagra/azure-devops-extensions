import { WebApiTeam } from "azure-devops-extension-api/Core";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { IPicklistPickerSharedProps, picklistRenderer } from "Common/Components/Pickers/PicklistPicker";
import { useTeams } from "Common/Hooks/AzDev/Teams";
import { getTeamModule } from "Common/Redux/Teams";
import * as React from "react";

function TeamPickerInternal(props: IPicklistPickerSharedProps<WebApiTeam>) {
    const { placeholder } = props;
    const { teams } = useTeams();

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
