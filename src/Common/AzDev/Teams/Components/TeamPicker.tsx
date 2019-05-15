import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { dropdownRenderer, IDropdownPickerSharedProps } from "Common/Components/Pickers/DropdownPicker";
import * as React from "react";
import { useTeams } from "../Hooks/useTeams";
import { getTeamModule } from "../Redux/Module";

function TeamPickerInternal(props: IDropdownPickerSharedProps<WebApiTeam>) {
    const { placeholder } = props;
    const { teams } = useTeams();

    return dropdownRenderer({ ...props, placeholder: placeholder || "Select a team" }, teams, (team: WebApiTeam) => ({
        id: team.id,
        text: team.name
    }));
}

export function TeamPicker(props: IDropdownPickerSharedProps<WebApiTeam>) {
    return (
        <DynamicModuleLoader modules={[getTeamModule()]}>
            <TeamPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
