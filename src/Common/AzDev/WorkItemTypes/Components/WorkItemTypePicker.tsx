import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { IPicklistPickerSharedProps, picklistRenderer } from "Common/Components/Pickers/PicklistPicker";
import * as React from "react";
import { useWorkItemTypes } from "../Hooks/useWorkItemTypes";
import { getWorkItemTypeModule } from "../Redux";

function WorkItemTypePickerInternal(props: IPicklistPickerSharedProps<WorkItemType>) {
    const { placeholder } = props;
    const { workItemTypes } = useWorkItemTypes();

    return picklistRenderer({ ...props, placeholder: placeholder || "Select a work item type" }, workItemTypes, (wit: WorkItemType) => ({
        key: wit.name,
        name: wit.name
    }));
}

export function WorkItemTypePicker(props: IPicklistPickerSharedProps<WorkItemType>) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTypeModule()]}>
            <WorkItemTypePickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
