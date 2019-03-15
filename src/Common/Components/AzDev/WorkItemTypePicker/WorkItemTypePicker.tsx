import { WorkItemType } from "azure-devops-extension-api/WorkItemTracking";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    IPicklistPickerSharedProps, picklistRenderer
} from "Common/Components/Pickers/PicklistPicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    areWorkItemTypesLoading, getWorkItemTypeModule, getWorkItemTypes, IWorkItemTypeAwareState,
    WorkItemTypeActions
} from "Common/Redux/WorkItemTypes";
import * as React from "react";

interface IWorkItemTypePickerStateProps {
    workItemTypes?: WorkItemType[];
    loading: boolean;
}

function mapStateToProps(state: IWorkItemTypeAwareState): IWorkItemTypePickerStateProps {
    return {
        workItemTypes: getWorkItemTypes(state),
        loading: areWorkItemTypesLoading(state)
    };
}

const Actions = { loadWorkItemTypes: WorkItemTypeActions.loadRequested };

function WorkItemTypePickerInternal(props: IPicklistPickerSharedProps<WorkItemType>) {
    const { placeholder } = props;
    const { workItemTypes, loading } = useMappedState(mapStateToProps);
    const { loadWorkItemTypes } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!workItemTypes && !loading) {
            loadWorkItemTypes();
        }
    }, []);

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
