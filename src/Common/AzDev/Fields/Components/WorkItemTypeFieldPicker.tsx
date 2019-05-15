import { FieldType, WorkItemField } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { equals } from "azure-devops-ui/Core/Util/String";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { dropdownRenderer, IDropdownPickerSharedProps } from "Common/Components/Pickers/DropdownPicker";
import { contains } from "Common/Utilities/Array";
import * as React from "react";
import { useFields } from "../Hooks/useFields";
import { useWorkItemTypeFields } from "../Hooks/useWorkItemTypeFields";
import { getFieldModule } from "../Redux/Module";

interface IWorkItemTypeFieldPickerProps extends IDropdownPickerSharedProps<WorkItemField> {
    workItemTypeName: string;
    allowedFieldTypes?: FieldType[];
    excludeFieldRefNames?: string[];
}

function WorkItemTypeFieldPickerInternal(props: IWorkItemTypeFieldPickerProps) {
    const { workItemTypeName, allowedFieldTypes, excludeFieldRefNames, placeholder } = props;
    const { fields: allFields } = useFields();
    const { fields: workItemTypeFields } = useWorkItemTypeFields(workItemTypeName);

    let comboFields: WorkItemField[] | undefined;
    if (allFields && workItemTypeFields) {
        comboFields = allFields.filter((f: any) => {
            const witFields = workItemTypeFields.map((f: any) => f.referenceName);
            return (
                (!allowedFieldTypes || allowedFieldTypes.indexOf(f.type) !== -1) &&
                (!excludeFieldRefNames || !contains(excludeFieldRefNames, f.referenceName, (a, b) => equals(a, b, true))) &&
                contains(witFields, f.referenceName, (s1, s2) => equals(s1, s2, true))
            );
        });
    }

    return dropdownRenderer({ ...props, placeholder: placeholder || "Select a work item field" }, comboFields, (field: WorkItemField) => ({
        id: field.referenceName,
        text: field.name
    }));
}

export function WorkItemTypeFieldPicker(props: IWorkItemTypeFieldPickerProps) {
    return (
        <DynamicModuleLoader modules={[getFieldModule()]}>
            <WorkItemTypeFieldPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
