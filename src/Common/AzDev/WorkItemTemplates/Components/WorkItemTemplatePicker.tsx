import * as React from "react";

import { WorkItemTemplateReference } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { dropdownRenderer, IDropdownPickerSharedProps } from "Common/Components/Pickers/DropdownPicker";

import { useTeamTemplates } from "../Hooks/useTeamTemplates";
import { getWorkItemTemplateModule } from "../Redux/Module";

interface IWorkItemTemplatePickerProps extends IDropdownPickerSharedProps<WorkItemTemplateReference> {
    teamId: string;
}

function WorkItemTemplatePickerInternal(props: IWorkItemTemplatePickerProps) {
    const { teamId, placeholder } = props;
    const { templates } = useTeamTemplates(teamId);

    return dropdownRenderer({ ...props, placeholder: placeholder || "Select a template" }, templates, (template: WorkItemTemplateReference) => ({
        id: template.id,
        text: template.name
    }));
}

export function WorkItemTemplatePicker(props: IWorkItemTemplatePickerProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTemplateModule()]}>
            <WorkItemTemplatePickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
