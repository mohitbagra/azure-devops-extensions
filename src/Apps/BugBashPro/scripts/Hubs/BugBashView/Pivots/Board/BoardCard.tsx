import "./BoardCard.scss";

import { BugBashItemEditorPortalActions } from "BugBashPro/Portals/BugBashItemEditorPortal/Redux/Actions";
import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { BugBashItemsActions } from "BugBashPro/Shared/Redux/BugBashItems/Actions";
// import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";

export const Actions = {
    openEditorPanel: BugBashItemEditorPortalActions.openPortal,
    deleteBugBashItem: BugBashItemsActions.bugBashItemDeleteRequested
};

interface IBoardCardProps {
    bugBashItem: IBugBashItem;
}

export function BoardCard(props: IBoardCardProps) {
    const { bugBashItem } = props;
    // const { openEditorPanel, deleteBugBashItem } = useActionCreators(Actions);

    return (
        <div className="board-card depth-8 scroll-hidden">
            <div className="card-title">{bugBashItem.title}</div>
        </div>
    );
}
