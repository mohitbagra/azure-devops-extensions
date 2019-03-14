import * as React from "react";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    BugBashItemEditorPortalActions, getEditBugBashItemBugBash, getEditBugBashItemId,
    IBugBashItemEditorPortalAwareState, isBugBashItemEditorPortalOpen
} from "../Redux/Portal";
import { BugBashItemEditorPanel } from "./BugBashItemEditorPanel";

interface IDynamicBugBashItemEditorPortalStateProps {
    panelOpen: boolean;
    bugBash?: IBugBash;
    bugBashItemId?: string;
}

function mapStateToProps(state: IBugBashItemEditorPortalAwareState): IDynamicBugBashItemEditorPortalStateProps {
    return {
        panelOpen: isBugBashItemEditorPortalOpen(state),
        bugBashItemId: getEditBugBashItemId(state),
        bugBash: getEditBugBashItemBugBash(state)
    };
}

const Actions = {
    dismissPortal: BugBashItemEditorPortalActions.dismissPortal
};

export function DynamicBugBashItemEditorPortal() {
    const { panelOpen, bugBashItemId, bugBash } = useMappedState(mapStateToProps);
    const { dismissPortal } = useActionCreators(Actions);

    if (!panelOpen || !bugBash) {
        return null;
    }

    return <BugBashItemEditorPanel bugBash={bugBash} bugBashItemId={bugBashItemId} onDismiss={dismissPortal} />;
}
