import { BugBashItemEditorPanel } from "BugBashPro/Editors/BugBashItemEditor";
import { IBugBash } from "BugBashPro/Shared/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import {
    BugBashItemEditorPortalActions,
    getEditBugBashItemBugBash,
    getEditBugBashItemId,
    IBugBashItemEditorPortalAwareState,
    isBugBashItemEditorPortalOpen,
    shouldReadFromCache
} from "../Redux";

interface IDynamicBugBashItemEditorPortalStateProps {
    panelOpen: boolean;
    readFromCache: boolean;
    bugBash?: IBugBash;
    bugBashItemId?: string;
}

function mapStateToProps(state: IBugBashItemEditorPortalAwareState): IDynamicBugBashItemEditorPortalStateProps {
    return {
        panelOpen: isBugBashItemEditorPortalOpen(state),
        bugBashItemId: getEditBugBashItemId(state),
        bugBash: getEditBugBashItemBugBash(state),
        readFromCache: shouldReadFromCache(state)
    };
}

const Actions = {
    dismissPortal: BugBashItemEditorPortalActions.dismissPortal
};

export function DynamicBugBashItemEditorPortal() {
    const { panelOpen, bugBashItemId, bugBash, readFromCache } = useMappedState(mapStateToProps);
    const { dismissPortal } = useActionCreators(Actions);

    if (!panelOpen || !bugBash) {
        return null;
    }

    return <BugBashItemEditorPanel bugBash={bugBash} bugBashItemId={bugBashItemId} onDismiss={dismissPortal} readFromCache={readFromCache} />;
}
