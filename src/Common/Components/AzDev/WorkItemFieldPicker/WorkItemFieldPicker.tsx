import {
    FieldType, WorkItemField, WorkItemTypeFieldWithReferences
} from "azure-devops-extension-api/WorkItemTracking";
import { equals } from "azure-devops-ui/Core/Util/String";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    IPicklistPickerSharedProps, picklistRenderer
} from "Common/Components/Pickers/PicklistPicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    areFieldsLoading, areWorkItemTypeFieldsLoading, FieldActions, getFieldModule, getFields,
    getWorkItemTypeFields, IFieldAwareState, WorkItemTypeFieldActions
} from "Common/Redux/Fields";
import { contains } from "Common/Utilities/Array";
import * as React from "react";

interface IWorkItemFieldPickerStateProps {
    allFields?: WorkItemField[];
    workItemTypeFields?: WorkItemTypeFieldWithReferences[];
    allFieldsLoading: boolean;
    workItemTypeFieldsLoading: boolean;
}

interface IWorkItemFieldPickerOwnProps extends IPicklistPickerSharedProps<WorkItemField> {
    allowedFieldTypes?: FieldType[];
    workItemType?: string;
    excludeFieldRefNames?: string[];
}

const Actions = {
    loadFields: FieldActions.loadRequested,
    loadWorkItemTypeFields: WorkItemTypeFieldActions.loadRequested
};

function WorkItemFieldPickerInternal(props: IWorkItemFieldPickerOwnProps) {
    const { workItemType, allowedFieldTypes, excludeFieldRefNames, placeholder } = props;
    const mapStateToProps = React.useCallback(
        (state: IFieldAwareState): IWorkItemFieldPickerStateProps => {
            return {
                allFields: getFields(state),
                workItemTypeFields: workItemType ? getWorkItemTypeFields(state, workItemType) : undefined,
                allFieldsLoading: areFieldsLoading(state),
                workItemTypeFieldsLoading: !!(workItemType && areWorkItemTypeFieldsLoading(state, workItemType))
            };
        },
        [workItemType]
    );
    const { allFields, workItemTypeFields, allFieldsLoading, workItemTypeFieldsLoading } = useMappedState(mapStateToProps);
    const { loadFields, loadWorkItemTypeFields } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!allFields && !allFieldsLoading) {
            loadFields();
        }
        if (workItemType && !workItemTypeFields && !workItemTypeFieldsLoading) {
            loadWorkItemTypeFields(workItemType);
        }
    }, [workItemType]);

    let comboFields: WorkItemField[] | undefined;
    if (allFields && (!workItemType || workItemTypeFields)) {
        comboFields = allFields.filter((f: any) => {
            const witFields = workItemTypeFields ? workItemTypeFields.map((f: any) => f.referenceName) : undefined;
            return (
                (!allowedFieldTypes || allowedFieldTypes.indexOf(f.type) !== -1) &&
                (!excludeFieldRefNames || !contains(excludeFieldRefNames, f.referenceName, (a, b) => equals(a, b, true))) &&
                (!workItemType || contains(witFields || [], f.referenceName, (s1, s2) => equals(s1, s2, true)))
            );
        });
    }

    return picklistRenderer({ ...props, placeholder: placeholder || "Select a work item field" }, comboFields, (field: WorkItemField) => ({
        key: field.referenceName,
        name: field.name
    }));
}

export function WorkItemFieldPicker(props: IWorkItemFieldPickerOwnProps) {
    return (
        <DynamicModuleLoader modules={[getFieldModule()]}>
            <WorkItemFieldPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}
