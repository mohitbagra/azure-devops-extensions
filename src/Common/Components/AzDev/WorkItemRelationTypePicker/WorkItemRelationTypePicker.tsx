import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { IPicklistPickerSharedProps, picklistRenderer } from "Common/Components/Pickers/PicklistPicker";
import { useWorkItemRelationTypes } from "Common/Hooks/AzDev/WorkItemRelationTypes/useWorkItemRelationTypes";
import { getWorkItemRelationTypeModule } from "Common/Redux/WorkItemRelationTypes";
import * as React from "react";

function WorkItemRelationTypePickerInternal(props: IPicklistPickerSharedProps<WorkItemRelationType>) {
    const { placeholder } = props;
    const { relationTypes } = useWorkItemRelationTypes();

    return picklistRenderer(
        { ...props, placeholder: placeholder || "Select a work item relation type" },
        relationTypes,
        (relationType: WorkItemRelationType) => ({
            key: relationType.referenceName,
            name: relationType.name
        })
    );
}

export function WorkItemRelationTypePicker(props: IPicklistPickerSharedProps<WorkItemRelationType>) {
    return (
        <DynamicModuleLoader modules={[getWorkItemRelationTypeModule()]}>
            <WorkItemRelationTypePickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
