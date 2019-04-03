import { BugBashItemEditorPanel } from "BugBashPro/Editors/BugBashItemEditor";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import {
    BugBashItemEditorPortalActions,
    getEditBugBashItemBugBashId,
    getEditBugBashItemId,
    IBugBashItemEditorPortalAwareState,
    isBugBashItemEditorPortalOpen,
    shouldReadFromCache
} from "../Redux";

interface IBugBashItemEditorPortalStateProps {
    panelOpen: boolean;
    readFromCache: boolean;
    bugBashId?: string;
    bugBashItemId?: string;
}

function mapStateToProps(state: IBugBashItemEditorPortalAwareState): IBugBashItemEditorPortalStateProps {
    return {
        panelOpen: isBugBashItemEditorPortalOpen(state),
        bugBashItemId: getEditBugBashItemId(state),
        bugBashId: getEditBugBashItemBugBashId(state),
        readFromCache: shouldReadFromCache(state)
    };
}

const Actions = {
    dismissPortal: BugBashItemEditorPortalActions.dismissPortal
};

export function BugBashItemEditorPortal() {
    const { panelOpen, bugBashItemId, bugBashId, readFromCache } = useMappedState(mapStateToProps);
    const { dismissPortal } = useActionCreators(Actions);

    if (!panelOpen || !bugBashId) {
        return null;
    }

    return <BugBashItemEditorPanel bugBashId={bugBashId} bugBashItemId={bugBashItemId} onDismiss={dismissPortal} readFromCache={readFromCache} />;
}
