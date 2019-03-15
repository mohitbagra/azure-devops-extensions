import { WorkItemRelationType } from "azure-devops-extension-api/WorkItemTracking";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    IPicklistPickerSharedProps, picklistRenderer
} from "Common/Components/Pickers/PicklistPicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    areWorkItemRelationTypesLoading, getWorkItemRelationTypeModule, getWorkItemRelationTypes,
    IWorkItemRelationTypeAwareState, WorkItemRelationTypeActions
} from "Common/Redux/WorkItemRelationTypes";
import * as React from "react";

interface IWorkItemRelationTypePickerStateProps {
    workItemRelationTypes?: WorkItemRelationType[];
    loading: boolean;
}

function mapStateToProps(state: IWorkItemRelationTypeAwareState): IWorkItemRelationTypePickerStateProps {
    return {
        workItemRelationTypes: getWorkItemRelationTypes(state),
        loading: areWorkItemRelationTypesLoading(state)
    };
}

const Actions = {
    loadRelationTypes: WorkItemRelationTypeActions.loadRequested
};

function WorkItemRelationTypePickerInternal(props: IPicklistPickerSharedProps<WorkItemRelationType>) {
    const { placeholder } = props;
    const { workItemRelationTypes, loading } = useMappedState(mapStateToProps);
    const { loadRelationTypes } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!workItemRelationTypes && !loading) {
            loadRelationTypes();
        }
    }, []);

    return picklistRenderer(
        { ...props, placeholder: placeholder || "Select a work item relation type" },
        workItemRelationTypes,
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
