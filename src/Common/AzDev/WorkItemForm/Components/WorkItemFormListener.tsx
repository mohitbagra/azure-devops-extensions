import {
    IWorkItemChangedArgs,
    IWorkItemFieldChangedArgs,
    IWorkItemLoadedArgs,
    IWorkItemNotificationListener
} from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import * as SDK from "azure-devops-extension-sdk";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { WorkItemFormActions } from "../Redux/Actions";
import { IWorkItemFormAwareState } from "../Redux/Contracts";
import { getWorkItemFormModule } from "../Redux/Module";
import { getActiveWorkItemId, isActiveWorkItemNew, isActiveWorkItemReadOnly } from "../Redux/Selectors";

interface IWorkItemFormListenerProps {
    instanceId: string;
    children: (workItemId: number, isNew: boolean, isReadOnly: boolean) => JSX.Element | null;
}

interface IWorkItemFormListenerStateProps {
    activeWorkItemId: number | undefined;
    isNew: boolean;
    isReadOnly: boolean;
}

function mapState(state: IWorkItemFormAwareState): IWorkItemFormListenerStateProps {
    return {
        activeWorkItemId: getActiveWorkItemId(state),
        isNew: isActiveWorkItemNew(state),
        isReadOnly: isActiveWorkItemReadOnly(state)
    };
}

const Actions = {
    workItemLoaded: WorkItemFormActions.workItemLoaded,
    workItemUnloaded: WorkItemFormActions.workItemUnloaded,
    workItemSaved: WorkItemFormActions.workItemSaved,
    workItemRefreshed: WorkItemFormActions.workItemRefreshed,
    workItemReset: WorkItemFormActions.workItemReset,
    workItemFieldChanged: WorkItemFormActions.workItemFieldChanged
};

function WorkItemFormListenerInternal(props: IWorkItemFormListenerProps) {
    const { instanceId, children } = props;
    const { activeWorkItemId, isNew, isReadOnly } = useMappedState(mapState);
    const { workItemFieldChanged, workItemLoaded, workItemRefreshed, workItemReset, workItemSaved, workItemUnloaded } = useActionCreators(Actions);

    React.useEffect(() => {
        SDK.register(instanceId, {
            onLoaded: (args: IWorkItemLoadedArgs) => {
                workItemLoaded(args);
            },
            onUnloaded: (args: IWorkItemChangedArgs) => {
                workItemUnloaded(args);
            },
            onSaved: (args: IWorkItemChangedArgs) => {
                workItemSaved(args);
            },
            onRefreshed: (args: IWorkItemChangedArgs) => {
                workItemRefreshed(args);
            },
            onReset: (args: IWorkItemChangedArgs) => {
                workItemReset(args);
            },
            onFieldChanged: (args: IWorkItemFieldChangedArgs) => {
                workItemFieldChanged(args);
            }
        } as IWorkItemNotificationListener);

        return SDK.unregister(instanceId);
    }, []);

    if (!activeWorkItemId) {
        return null;
    } else {
        return children(activeWorkItemId, isNew, isReadOnly);
    }
}

export function WorkItemFormListener(props: IWorkItemFormListenerProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemFormModule()]} cleanOnUnmount={true}>
            <WorkItemFormListenerInternal {...props} />
        </DynamicModuleLoader>
    );
}
