import * as React from "react";

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

import { WorkItemFormActions } from "../Redux/Actions";
import { IWorkItemFormAwareState } from "../Redux/Contracts";
import { getWorkItemFormModule } from "../Redux/Module";
import { getActiveWorkItemId, hasActiveWorkItem, isActiveWorkItemNew, isActiveWorkItemReadOnly } from "../Redux/Selectors";

interface IWorkItemFormListenerProps {
    children: (workItemId: number, isNew: boolean, isReadOnly: boolean) => JSX.Element | null;
}

interface IWorkItemFormListenerStateProps {
    hasActiveWorkItem: boolean;
    activeWorkItemId: number | undefined;
    isNew: boolean;
    isReadOnly: boolean;
}

function mapState(state: IWorkItemFormAwareState): IWorkItemFormListenerStateProps {
    return {
        hasActiveWorkItem: hasActiveWorkItem(state),
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
    const { children } = props;
    const { hasActiveWorkItem, activeWorkItemId, isNew, isReadOnly } = useMappedState(mapState);
    const { workItemFieldChanged, workItemLoaded, workItemRefreshed, workItemReset, workItemSaved, workItemUnloaded } = useActionCreators(Actions);

    React.useEffect(() => {
        SDK.init({ applyTheme: true }).then(() => {
            SDK.register(SDK.getContributionId(), {
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
        });
    }, []);

    if (!hasActiveWorkItem) {
        return null;
    } else {
        return children(activeWorkItemId!, isNew, isReadOnly);
    }
}

export function WorkItemFormListener(props: IWorkItemFormListenerProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemFormModule()]} cleanOnUnmount={true}>
            <WorkItemFormListenerInternal {...props} />
        </DynamicModuleLoader>
    );
}
