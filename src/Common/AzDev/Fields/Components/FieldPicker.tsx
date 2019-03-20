import { FieldType, WorkItemField } from "azure-devops-extension-api/WorkItemTracking";
import { equals } from "azure-devops-ui/Core/Util/String";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { IPicklistPickerSharedProps, picklistRenderer } from "Common/Components/Pickers/PicklistPicker";
import { contains } from "Common/Utilities/Array";
import * as React from "react";
import { useFields } from "../Hooks/useFields";
import { getFieldModule } from "../Redux";

interface IFieldPickerProps extends IPicklistPickerSharedProps<WorkItemField> {
    allowedFieldTypes?: FieldType[];
    excludeFieldRefNames?: string[];
}

function FieldPickerInternal(props: IFieldPickerProps) {
    const { allowedFieldTypes, excludeFieldRefNames, placeholder } = props;
    const { fields } = useFields();

    let comboFields: WorkItemField[] | undefined;
    if (fields) {
        comboFields = fields.filter((f: any) => {
            return (
                (!allowedFieldTypes || allowedFieldTypes.indexOf(f.type) !== -1) &&
                (!excludeFieldRefNames || !contains(excludeFieldRefNames, f.referenceName, (a, b) => equals(a, b, true)))
            );
        });
    }

    return picklistRenderer({ ...props, placeholder: placeholder || "Select a work item field" }, comboFields, (field: WorkItemField) => ({
        key: field.referenceName,
        name: field.name
    }));
}

export function FieldPicker(props: IFieldPickerProps) {
    return (
        <DynamicModuleLoader modules={[getFieldModule()]}>
            <FieldPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
