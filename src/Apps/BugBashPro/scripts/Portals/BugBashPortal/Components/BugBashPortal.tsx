import * as DetailsEditor_Async from "BugBashPro/Editors/BugBashDetailsEditor";
import * as BugBashEditor_Async from "BugBashPro/Editors/BugBashEditor";
import * as BugBashItemEditor_Async from "BugBashPro/Editors/BugBashItemEditor";
import * as SettingsEditor_Async from "BugBashPro/Editors/BugBashSettingsEditor";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { emptyRenderer } from "Common/Components/Renderers";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { BugBashPortalActions } from "../Redux/Actions";
import {
    IBugBashDetailsEditPortalProps,
    IBugBashEditPortalProps,
    IBugBashItemEditPortalProps,
    IBugBashPortalAwareState,
    PortalType
} from "../Redux/Contracts";
import { getBugBashPortalModule } from "../Redux/Module";
import { getPortalProps, getPortalType, isPortalOpen } from "../Redux/Selectors";

interface IBugBashPortalStateProps {
    portalOpen: boolean;
    portalType: PortalType | undefined;
    portalProps: IBugBashEditPortalProps | IBugBashItemEditPortalProps | IBugBashDetailsEditPortalProps | undefined;
}

function mapState(state: IBugBashPortalAwareState): IBugBashPortalStateProps {
    return {
        portalOpen: isPortalOpen(state),
        portalType: getPortalType(state),
        portalProps: getPortalProps(state)
    };
}

const Actions = {
    dismissPortal: BugBashPortalActions.dismissPortal
};

const bugBashEditorLoader = async () => import("BugBashPro/Editors/BugBashEditor");
const bugBashItemEditorLoader = async () => import("BugBashPro/Editors/BugBashItemEditor");
const settingsEditorLoader = async () => import("BugBashPro/Editors/BugBashSettingsEditor");
const bugBashDetailsEditorLoader = async () => import("BugBashPro/Editors/BugBashDetailsEditor");

function BugBashPortalInternal() {
    const { portalOpen, portalProps, portalType } = useMappedState(mapState);
    const { dismissPortal } = useActionCreators(Actions);

    if (!portalOpen || portalType === undefined) {
        return null;
    }

    if (portalType === PortalType.BugBashEdit) {
        const { bugBashId, readFromCache } = portalProps as IBugBashEditPortalProps;
        return (
            <AsyncComponent key="bug-bash-editor" loader={bugBashEditorLoader} loadingComponent={emptyRenderer}>
                {(m: typeof BugBashEditor_Async) => (
                    <m.BugBashEditorPanel bugBashId={bugBashId} readFromCache={readFromCache} onDismiss={dismissPortal} />
                )}
            </AsyncComponent>
        );
    } else if (portalType === PortalType.BugBashItemEdit) {
        const { bugBashId, bugBashItemId, readFromCache } = portalProps as IBugBashItemEditPortalProps;
        return (
            <AsyncComponent key="bug-bash-item-editor" loader={bugBashItemEditorLoader} loadingComponent={emptyRenderer}>
                {(m: typeof BugBashItemEditor_Async) => (
                    <m.BugBashItemEditorPanel
                        bugBashId={bugBashId}
                        bugBashItemId={bugBashItemId}
                        readFromCache={readFromCache}
                        onDismiss={dismissPortal}
                    />
                )}
            </AsyncComponent>
        );
    } else if (portalType === PortalType.SettingsEdit) {
        return (
            <AsyncComponent key="settings-editor" loader={settingsEditorLoader} loadingComponent={emptyRenderer}>
                {(m: typeof SettingsEditor_Async) => <m.BugBashSettingsEditorPanel onDismiss={dismissPortal} />}
            </AsyncComponent>
        );
    } else if (portalType === PortalType.DetailsEdit) {
        const { bugBashId } = portalProps as IBugBashDetailsEditPortalProps;
        return (
            <AsyncComponent key="details-editor" loader={bugBashDetailsEditorLoader} loadingComponent={emptyRenderer}>
                {(m: typeof DetailsEditor_Async) => <m.BugBashDetailsEditorPanel bugBashId={bugBashId} onDismiss={dismissPortal} />}
            </AsyncComponent>
        );
    } else {
        return null;
    }
}

export function BugBashPortal() {
    return (
        <DynamicModuleLoader modules={[getBugBashPortalModule()]} cleanOnUnmount={true}>
            <BugBashPortalInternal />
        </DynamicModuleLoader>
    );
}
