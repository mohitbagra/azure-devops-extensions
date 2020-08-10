import * as React from "react";

import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { dropdownRenderer, IDropdownPickerSharedProps } from "Common/Components/Pickers/DropdownPicker";

import { useWorkItemRelationTypes } from "../Hooks/useWorkItemRelationTypes";
import { getWorkItemRelationTypeModule } from "../Redux/Module";

function WorkItemRelationTypePickerInternal(props: IDropdownPickerSharedProps<WorkItemRelationType>) {
    const { placeholder } = props;
    const { relationTypes } = useWorkItemRelationTypes();

    return dropdownRenderer(
        { ...props, placeholder: placeholder || "Select a work item relation type" },
        relationTypes,
        (relationType: WorkItemRelationType) => ({
            id: relationType.referenceName,
            text: relationType.name
        })
    );
}

export function WorkItemRelationTypePicker(props: IDropdownPickerSharedProps<WorkItemRelationType>) {
    return (
        <DynamicModuleLoader modules={[getWorkItemRelationTypeModule()]}>
            <WorkItemRelationTypePickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
