import * as React from "react";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    BugBashEditorPortalActions, getEditBugBashId, IBugBashEditorPortalAwareState,
    isBugBashEditorPortalOpen
} from "../Redux/Portal";
import { BugBashEditorPanel } from "./BugBashEditorPanel";

interface IDynamicBugBashEditorPortalStateProps {
    panelOpen: boolean;
    bugBashId?: string;
}

function mapStateToProps(state: IBugBashEditorPortalAwareState): IDynamicBugBashEditorPortalStateProps {
    return {
        panelOpen: isBugBashEditorPortalOpen(state),
        bugBashId: getEditBugBashId(state)
    };
}

const Actions = {
    dismissPortal: BugBashEditorPortalActions.dismissPortal
};

export function DynamicBugBashEditorPortal() {
    const { panelOpen, bugBashId } = useMappedState(mapStateToProps);
    const { dismissPortal } = useActionCreators(Actions);

    if (!panelOpen) {
        return null;
    }

    return <BugBashEditorPanel bugBashId={bugBashId} onDismiss={dismissPortal} />;
}
