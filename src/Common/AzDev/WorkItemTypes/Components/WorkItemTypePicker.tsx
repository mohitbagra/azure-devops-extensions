import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { dropdownRenderer, IDropdownPickerSharedProps } from "Common/Components/Pickers/DropdownPicker";
import * as React from "react";
import { useWorkItemTypes } from "../Hooks/useWorkItemTypes";
import { getWorkItemTypeModule } from "../Redux/Module";

function WorkItemTypePickerInternal(props: IDropdownPickerSharedProps<WorkItemType>) {
    const { placeholder } = props;
    const { workItemTypes } = useWorkItemTypes();

    return dropdownRenderer({ ...props, placeholder: placeholder || "Select a work item type" }, workItemTypes, (wit: WorkItemType) => ({
        id: wit.name,
        text: wit.name
    }));
}

export function WorkItemTypePicker(props: IDropdownPickerSharedProps<WorkItemType>) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTypeModule()]}>
            <WorkItemTypePickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
